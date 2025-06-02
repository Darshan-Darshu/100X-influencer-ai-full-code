import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  console.log("Hi");

  const gather = twiml.gather({
    input: ["speech"],
    timeout: 5,
    speechTimeout: "auto",
    action: "/api/speech",
    method: "POST",
  });

  gather.say("Hello! I am Darshan, ");

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
