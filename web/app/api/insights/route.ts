import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
