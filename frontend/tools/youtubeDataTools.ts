import { mockData } from "@/data/data";
import { tool } from "ai";
import { z } from "zod";

const apiEndpointsYoutube = "https://www.googleapis.com/youtube/v3";

export const youtubeDataTool = tool({
  description: "Get the influencer data from a youtube",
  parameters: z.object({
    query: z.string().describe("Branch name to search influencer"),
  }),
  // location below is inferred to be a string:
  execute: async ({ query }) => {
    console.log("Youtube Tool", query);
    const calculateEngagementRate = (stats: any) => {
      if (!stats.subscriberCount || stats.subscriberCount === 0) return 0;
      const avgViews = parseInt(stats.viewCount) / parseInt(stats.videoCount);
      return ((avgViews / parseInt(stats.subscriberCount)) * 100).toFixed(1);
    };

    const searchYouTubeChannels = async (query: string) => {
      try {
        const response = await fetch(
          `${apiEndpointsYoutube}/search?part=snippet&type=channel&q=${encodeURIComponent(
            query
          )}&key=${process.env.YOUTUBE_ACCESS_TOKEN}&maxResults=20`
        );

        // console.log(response);

        if (!response.ok) throw new Error("YouTube API request failed");
        const data = await response.json();

        // console.log(data);

        // Get detailed channel statistics
        const channelIds = data.items
          .map((item: any) => item.snippet.channelId)
          .join(",");
        const statsResponse = await fetch(
          `${apiEndpointsYoutube}/channels?part=statistics,snippet&id=${channelIds}&key=${process.env.YOUTUBE_ACCESS_TOKEN}`
        );

        const statsData = await statsResponse.json();

        return statsData.items.map((channel: any) => ({
          id: channel.id,
          name: channel.snippet.title,
          handle: `@${
            channel.snippet.customUrl ||
            channel.snippet.title.replace(/\s+/g, "").toLowerCase()
          }`,
          platform: "youtube",
          followers: parseInt(channel.statistics.subscriberCount || 0),
          profileImage: channel.snippet.thumbnails.default.url,
          bio: channel.snippet.description.substring(0, 100) + "...",
          totalVideos: parseInt(channel.statistics.videoCount || 0),
          totalViews: parseInt(channel.statistics.viewCount || 0),
          engagement: calculateEngagementRate(channel.statistics),
          location: channel.snippet.country || "Unknown",
        }));
      } catch (error) {
        console.error("YouTube search error:", error);
        throw error;
      }
    };

    const influencerData = await searchYouTubeChannels(query);

    console.log(influencerData);

    // const influencerData = mockData;
    return {
      influencerData,
    };
  },
});
