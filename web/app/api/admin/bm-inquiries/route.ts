import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const inquiries = await prisma.bMInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch BM inquiries:", error);
    return NextResponse.json(
      { error: "목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
