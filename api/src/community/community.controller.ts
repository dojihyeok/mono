import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // 1. 게시글 목록 조회
  @Get('posts')
  listPosts(
    @Query('channel') channel?: string,
    @Query('subChannel') subChannel?: string,
  ) {
    return this.communityService.listPosts(channel, subChannel);
  }

  // 2. 게시글 상세 조회
  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.communityService.getPost(id);
  }

  // 3. 게시글 생성
  @Post('posts')
  createPost(
    @Body()
    body: {
      channel: string;
      subChannel: string;
      title: string;
      content: string;
      authorId: string;
      ratings?: any;
    },
  ) {
    return this.communityService.createPost(body);
  }

  // 4. 댓글 작성
  @Post('posts/:id/comment')
  createComment(
    @Param('id') postId: string,
    @Body() body: { authorId: string; content: string },
  ) {
    return this.communityService.createComment(postId, body);
  }

  // 5. 좋아요
  @Post('posts/:id/like')
  likePost(@Param('id') id: string) {
    return this.communityService.likePost(id);
  }

  // 6. 도움돼요
  @Post('posts/:id/help')
  helpPost(@Param('id') id: string) {
    return this.communityService.helpPost(id);
  }

  // 7. 신고 등록
  @Post('posts/:id/report')
  reportPost(
    @Param('id') targetId: string,
    @Body() body: { targetType: string; reporterId: string; reason: string },
  ) {
    return this.communityService.reportPost({
      targetType: body.targetType || 'POST',
      targetId,
      reporterId: body.reporterId,
      reason: body.reason,
    });
  }
}
