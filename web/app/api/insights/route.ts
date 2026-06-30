import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const insights = await prisma.aiInsight.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return NextResponse.json({ ok: true, insights });
  } catch (error) {
    console.error("GET /api/insights error:", error);
    return NextResponse.json({ ok: false, insights: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();
    if (action === 'seed') {
      await prisma.aiInsight.deleteMany();
      await prisma.aiInsight.createMany({
        data: [
          {
            type: 'URGENT_JOB',
            title: '내 주변에 긴급하게 찾는 일자리가 있어요',
            content: '내가 선택한 근처 지역에서 지금 바로 지원 가능한 급구 일자리가 5건 등록되었습니다.',
            linkText: '근처 일자리 실시간 보기',
            linkTarget: 'jobs-nearby',
            active: true
          },
          {
            type: 'REGION_INFO',
            title: '광주/전남 지역 공사 현장이 늘어날 예정이에요',
            content: '최근 국토부 발표에 따라 반도체 AI 센터가 신설됩니다. 이에 따라 필요한 전기/통신 인력이 추가로 필요할 예정이에요. 앞으로 필요한 소요 인력은 약 500명인데 지금 200명이 부족한 상태에요.',
            linkText: '교육 프로그램 연계 알아보기',
            linkTarget: 'training-programs',
            active: true
          },
          {
            type: 'WEATHER_INFO',
            title: '장마기간 대비 성장 프로그램',
            content: '이번 주부터 장마가 시작되어 현장이 쉬는 곳이 많아요. 장마기간 동안 실내에서 이수할 수 있는 안전/직무 향상 교육 프로그램을 추천해 드립니다.',
            linkText: '성장 프로그램 보러가기',
            linkTarget: 'training-programs',
            active: true
          }
        ]
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
