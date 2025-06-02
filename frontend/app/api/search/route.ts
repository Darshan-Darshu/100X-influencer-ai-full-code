import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";

import { createOllama } from "ollama-ai-provider";
import { generateText } from "ai";
import { mockData } from "@/data/data";
import { youtubeDataTool } from "@/tools/youtubeDataTools";

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: "http://localhost:11434/api",
});

const apiEndpoints = {
  instagram: "https://graph.instagram.com/v18.0",
  youtube: "https://www.googleapis.com/youtube/v3",
  twitter: "https://api.twitter.com/2",
};

// Here is the influencer data ${response}

//        Influncer data is an array of each individual influencere object the structure is has below
//        [{
//         id: 'UCWS4nfoou79mwo9nHew49fA',
//         name: 'WHOOP UCI Mountain Bike World Series',
//         handle: '@@uci_mtbworldseries',
//         platform: 'youtube',
//         followers: 189000,
//         profileImage: 'https://yt3.ggpht.com/PzH-Hwk3r_VaJrU2gEWSiMPMeiNzeKfm5pfMhc6q0q3qqEii4DRWY4CAkTLYFCLMTHbvRJ0IfJc=s88-c-k-c0x00ffffff-no-rj',
//         bio: 'The Home of the WHOOP UCI Mountain Bike World Series.\n' +
//             '\n' +
//             'The WHOOP UCI Mountain Bike World Series unit...',
//         totalVideos: 1273,
//         totalViews: 26437951,
//         engagement: '11.0',
//         location: 'GB'
//        }, ...]

// Industry/Niche: [e.g., Eco-friendly skincare]

//         Target Audience: [e.g., Women aged 25–40, environmentally conscious, mid-to-high income]

//         Marketing Goal: [e.g., Drive website traffic, increase sales, grow brand awareness]

//         Brand Values: [e.g., Sustainability, transparency, innovation]
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { query } = await req.json(); // e.g., +91XXXXXXXXXX

  try {
    // const response = mockData;

    const reply = await generateText({
      //   model: ollama("llama3.2:latest"),
      model: openai("gpt-4o-mini"),
      prompt: `You are an expert brand strategist and influencer marketing specialist. Your task is to analyze YouTube influencers and select the top 5 best matches for a brand.

Brand Information:
- Brand Name: ${query}

Analysis Criteria:
1. Use youtubeDataTool to fetch influencer data
2. For each influencer, evaluate:
   - Content Relevance: How well their content aligns with the brand's industry
   - Audience Match: Whether their followers match the brand's target demographic
   - Engagement Quality: Look for meaningful interactions (comments, shares)
   - Content Quality: Assess video production value and consistency
   - Brand Safety: Check for any controversial content or brand risks
   - Growth Potential: Consider channel growth rate and future potential

Scoring System:
- Rate each influencer from 1-10 based on:
  * Content Alignment (30%)
  * Audience Match (25%)
  * Engagement Rate (20%)
  * Content Quality (15%)
  * Brand Safety (10%)

Required Output Format:
const creators = [
  {
    id: number,            // Unique identifier
    name: string,          // Full name of the creator
    handle: string,        // YouTube channel handle
    platform: "youtube",   // Platform name
    followers: string,     // Formatted follower count (e.g., "1.2M")
    engagement: string,    // Engagement rate as percentage
    category: string,      // Primary content category
    location: string,      // Creator's location
    rate: string,         // Estimated sponsorship rate
    avatar: string,       // Profile image URL
    verified: boolean,    // Verification status
    rating: number,       // Overall match score (1-10)
    languages: string[],  // Languages they create content in
    recentWork: string[], // 3 most recent notable collaborations
  }
];

Important:
- Only include influencers with engagement rates above 3%
- Ensure all data is accurate and from the API response
- Sort creators by rating in descending order
- Include detailed reasoning for each rating
- Focus on long-term brand alignment potential`,
      tools: {
        youtubeDataTool,
      },
      maxSteps: 20,
    });

    return NextResponse.json({ success: true, text: reply.text });
  } catch (error: any) {
    console.error("Call Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
