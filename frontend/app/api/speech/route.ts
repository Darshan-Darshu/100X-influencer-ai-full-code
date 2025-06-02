import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { createOllama } from "ollama-ai-provider";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: "http://localhost:11434/api",
});

function removeThinkTags(text: string) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();

  // Parse form-encoded data
  const params = new URLSearchParams(body);
  const userSpeech = params.get("SpeechResult");

  console.log("User said:", userSpeech);

  if (!userSpeech) {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      {
        voice: "Polly.Amy",
      },
      "Sorry, I did not catch that. Please try again."
    );
    twiml.redirect("/api/voice");
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Call OpenAI
  //   const aiResponse = await axios.post(
  //     'https://api.openai.com/v1/chat/completions',
  //     {
  //       model: 'gpt-3.5-turbo',
  //       messages: [{ role: 'user', content: userSpeech }],
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //       },
  //     }
  //   );

  const reply = await generateText({
    // model: ollama("deepseek-r1:latest"),
    model: openai("gpt-4o-mini"),
    prompt: `User Query: ${userSpeech}

Please respond as a professional brand representative making an initial call to an influencer. First, introduce our brand and then naturally transition into discussing potential collaboration and pricing.`,
    system: `You are a professional Brand Representative AI making an initial call to an influencer. Follow this structured conversation flow:

1. Brand Introduction (First Response):
- Introduce yourself as a brand representative
- Present our brand name and core values
- Briefly explain our market position and target audience
- Mention why we're interested in working with this influencer
- Example: "Hi Darshan, I'm DK from myntra. We're a fashion brand known for fashion ecommerce. We've been following your content and are particularly impressed by people enagement you have."

2. Value Proposition (Second Response):
- Explain what makes our brand unique
- Share our market reach and audience demographics
- Highlight successful past collaborations
- Mention our commitment to authentic partnerships
- Example: "What sets us apart is [unique selling point]. We have [X] followers across platforms and our audience primarily consists of [demographics]."

3. Collaboration Discussion (Third Response):
- Ask about their experience with brand collaborations
- Inquire about their content creation process
- Discuss potential campaign ideas
- Example: "We'd love to hear about your experience with brand partnerships. What types of collaborations have worked well for you in the past?"

4. Pricing Negotiation (Fourth Response):
- Ask about their standard rates
- Understand their pricing structure
- Discuss our budget range
- Example: "Could you share your standard rates for [type of content]? We have a budget range of [X-Y] for this campaign."

5. Negotiation Guidelines:
- Start with understanding their pricing expectations
- Be prepared to discuss different compensation models
- Consider value-adds beyond monetary compensation
- Maintain flexibility while staying within budget
- Focus on long-term partnership potential

6. Response Structure:
- Keep responses concise and natural
- Acknowledge their points before responding
- Use a friendly, professional tone
- Be transparent about our limitations
- Focus on mutual benefits

Remember to:
- Sound natural and conversational
- Listen actively to their responses
- Be prepared to adjust the approach based on their feedback
- Keep the conversation focused and professional
- Document key points discussed
- Be ready to schedule follow-up discussions

Current Brand Context:
- Brand Name: 100xEngineer
- Industry: Fashion
- Target Audience: Common people
- Budget Range: 1000 - 2000
- Campaign Goals: Need to buy more product with end of the year`,
  });

  const text = removeThinkTags(reply.text);

  console.log(text);

  const sentences = text.split(/(?<=[.?!])\s+/).slice(0, 2);

  //   const reply = aiResponse.data.choices[0].message.content;

  const twiml = new twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    input: ["speech"],
    timeout: 5,
    speechTimeout: "auto",
    action: "/api/speech", // Send next user reply here
    method: "POST",
  });

  // for (const sentence of sentences) {
  //   gather.say(sentence);
  //   gather.pause({ length: 1 });
  // }

  gather.say(reply.text);
  gather.pause({ length: 1 });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
