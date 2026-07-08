import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, contactName, contactMethod, interests, message } = body;

    if (!companyName || !contactName || !contactMethod) {
      return NextResponse.json(
        { error: "회사명, 담당자 이름, 연락처는 필수 항목입니다." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.bMInquiry.create({
      data: {
        companyName,
        contactName,
        contactMethod,
        interests: Array.isArray(interests) ? interests : [],
        message: message || "",
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to submit BM inquiry:", error);
    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
