import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // 1. 기존 인사이트 전부 비활성화
    await prisma.aiInsight.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // 2. Mock AI Insights 생성 (사용자가 요청한 3가지 케이스)
    const newInsights = [
      {
        type: "URGENT_JOB",
        title: "내 주변에 긴급하게 찾는 일자리가 있어요!",
        content: "현재 계신 위치 주변으로 일손이 시급한 현장 5곳이 새로 등록되었습니다.",
        linkText: "내 주변 일자리 보기",
        linkTarget: "jobs/nearby",
        active: true,
      },
      {
        type: "REGION_INFO",
        title: "광주 전남에 공사 현장이 늘어날 예정이에요",
        content: "국민보고회에 따르면 반도체 AI 센터가 건립될 예정입니다. 필요한 인력은 2,000명인데 현재 500명이 부족한 상태에요.",
        linkText: "모노와 함께 반도체 AI 센터 준비하기 (교육 연계)",
        linkTarget: "training",
        active: true,
      },
      {
        type: "WEATHER_INFO",
        title: "이번 주 장마 시작, 현장이 쉬는 곳이 많아요",
        content: "비가 오면 출역이 취소될 수 있습니다. 장마 기간 동안 실내에서 역량을 키울 수 있는 성장 프로그램을 소개합니다.",
        linkText: "비 오는 날 맞춤 교육 프로그램 보기",
        linkTarget: "training",
        active: true,
      },
    ];

    await prisma.aiInsight.createMany({
      data: newInsights,
    });

    return NextResponse.json({ ok: true, message: "AI 인사이트가 성공적으로 갱신되었습니다." });
  } catch (error) {
    console.error("POST /api/admin/insights/sync error:", error);
    return NextResponse.json({ ok: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
