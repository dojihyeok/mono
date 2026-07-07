import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 1. 금칙어 기반 텍스트 마스킹 처리 함수
  async maskText(text: string): Promise<string> {
    if (!text) return text;
    try {
      const blacklist = await this.prisma.blacklistWord.findMany();
      let masked = text;
      for (const item of blacklist) {
        // 대소문자 무시하고 매칭하여 마스킹 (***)
        const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        masked = masked.replace(regex, '***');
      }
      return masked;
    } catch (err) {
      this.logger.error('금칙어 마스킹 처리 중 오류:', err);
      return text;
    }
  }

  // 2. 게시글 생성
  async createPost(data: {
    channel: string;
    subChannel: string;
    title: string;
    content: string;
    authorId: string;
    ratings?: any;
  }) {
    // 텍스트 마스킹 적용
    const maskedTitle = await this.maskText(data.title);
    const maskedContent = await this.maskText(data.content);

    // author가 존재하는지 확인
    const author = await this.prisma.user.findUnique({
      where: { id: data.authorId },
    });
    if (!author) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return this.prisma.communityPost.create({
      data: {
        channel: data.channel,
        subChannel: data.subChannel,
        title: maskedTitle,
        content: maskedContent,
        authorId: data.authorId,
        ratings: data.ratings || undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  // 3. 게시글 목록 조회
  async listPosts(channel?: string, subChannel?: string) {
    const where: any = {};
    if (channel) where.channel = channel;
    if (subChannel) where.subChannel = subChannel;

    return this.prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. 게시글 상세 조회
  async getPost(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return post;
  }

  // 5. 댓글 작성
  async createComment(postId: string, data: { authorId: string; content: string }) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const maskedContent = await this.maskText(data.content);

    return this.prisma.communityComment.create({
      data: {
        postId,
        authorId: data.authorId,
        content: maskedContent,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  // 6. 좋아요(또는 도움돼요) 증가
  async likePost(id: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return this.prisma.communityPost.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  // 7. 도움돼요 증가
  async helpPost(id: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return this.prisma.communityPost.update({
      where: { id },
      data: { helps: { increment: 1 } },
    });
  }

  // 8. 신고 등록
  async reportPost(data: { targetType: string; targetId: string; reporterId: string; reason: string }) {
    const report = await this.prisma.communityReport.create({
      data: {
        targetType: data.targetType,
        targetId: data.targetId,
        reporterId: data.reporterId,
        reason: data.reason,
      },
    });

    // 만약 게시글 신고인 경우, 해당 게시글의 reported 플래그를 true로 갱신
    if (data.targetType === 'POST') {
      await this.prisma.communityPost.updateMany({
        where: { id: data.targetId },
        data: { reported: true },
      });
    }

    return report;
  }

  // ── 운영자 전용 기능 ──

  // 9. 신고 리스트 조회
  async listReports() {
    // 신고 목록을 조회하고, 각 신고의 대상(게시글 또는 댓글) 정보를 병합하여 리턴
    const reports = await this.prisma.communityReport.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const result = [];
    for (const r of reports) {
      let targetContent = '';
      let targetTitle = '';
      if (r.targetType === 'POST') {
        const post = await this.prisma.communityPost.findUnique({ where: { id: r.targetId } });
        if (post) {
          targetTitle = post.title;
          targetContent = post.content;
        } else {
          targetContent = '(삭제된 게시글)';
        }
      } else {
        const comment = await this.prisma.communityComment.findUnique({ where: { id: r.targetId } });
        if (comment) {
          targetContent = comment.content;
        } else {
          targetContent = '(삭제된 댓글)';
        }
      }
      result.push({
        ...r,
        targetTitle,
        targetContent,
      });
    }
    return result;
  }

  // 10. 게시글 강제 삭제
  async deletePost(id: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    // 관련 신고 정보도 함께 정리
    await this.prisma.communityReport.deleteMany({
      where: { targetType: 'POST', targetId: id },
    });
    return this.prisma.communityPost.delete({
      where: { id },
    });
  }

  // 11. 금칙어 조회
  async listBlacklist() {
    return this.prisma.blacklistWord.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 12. 금칙어 추가
  async addBlacklistWord(word: string) {
    return this.prisma.blacklistWord.upsert({
      where: { word },
      create: { word },
      update: {},
    });
  }

  // 13. 금칙어 삭제
  async removeBlacklistWord(id: string) {
    return this.prisma.blacklistWord.delete({
      where: { id },
    });
  }
}
