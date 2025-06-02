import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json(); //

  try {
    console.log("body", body);
    const data = {
      phoneNumber: body.data1,
      logs: body.data2,
      sid: body.sid,
    };

    if (body.data2) {
      await supabase.from("calllogs").insert(data);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Call Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
