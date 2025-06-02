import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { to } = await req.json(); // e.g., +91XXXXXXXXXX

  try {
    const call = await client.calls.create({
      // url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/voice`,
      url: `${process.env.REPLIT_URL}/incoming-call`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER!,
    });

    return NextResponse.json({ success: true, sid: call.sid });
  } catch (error: any) {
    console.error("Call Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
