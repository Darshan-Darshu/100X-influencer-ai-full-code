"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  TrendingUp,
  Filter,
  Star,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Loader,
  AlertCircle,
} from "lucide-react";

type Platform = "instagram" | "youtube" | "twitter";

const SocialMediaInfluencerFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("instagram");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKeys, setApiKeys] = useState({
    instagram: "",
    youtube: "",
    twitter: "",
  });
  const [showApiSetup, setShowApiSetup] = useState(true);

  // API configuration
  const apiEndpoints = {
    instagram: "https://graph.instagram.com/v18.0",
    youtube: "https://www.googleapis.com/youtube/v3",
    twitter: "https://api.twitter.com/2",
  };

  // Instagram API functions
  const searchInstagramUsers = async (query: string) => {
    try {
      // Note: Instagram Basic Display API requires user authentication
      // This is a simplified example - in production, you'd need proper OAuth flow
      const response = await fetch(
        `${apiEndpoints.instagram}/ig_hashtag_search?user_id=${
          apiKeys.instagram
        }&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${apiKeys.instagram}`,
          },
        }
      );

      if (!response.ok) throw new Error("Instagram API request failed");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Instagram search error:", error);
      throw error;
    }
  };

  // YouTube API functions
  const searchYouTubeChannels = async (query: string) => {
    try {
      const response = await fetch(
        `${
          apiEndpoints.youtube
        }/search?part=snippet&type=channel&q=${encodeURIComponent(
          query
        )}&key=${"AIzaSyAt7NnP-er0FvNHA6KRIQyupNa_yde2izo"}&maxResults=20`
      );

      console.log(response);

      if (!response.ok) throw new Error("YouTube API request failed");
      const data = await response.json();

      console.log(data);

      // Get detailed channel statistics
      const channelIds = data.items
        .map((item: any) => item.snippet.channelId)
        .join(",");
      const statsResponse = await fetch(
        `${
          apiEndpoints.youtube
        }/channels?part=statistics,snippet&id=${channelIds}&key=${"AIzaSyAt7NnP-er0FvNHA6KRIQyupNa_yde2izo"}`
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

  // Twitter API functions
  const searchTwitterUsers = async (query: string) => {
    try {
      const response = await fetch(
        `${apiEndpoints.twitter}/users/by?usernames=${encodeURIComponent(
          query
        )}&user.fields=public_metrics,description,location,profile_image_url,verified`,
        {
          headers: {
            Authorization: `Bearer ${apiKeys.twitter}`,
          },
        }
      );

      if (!response.ok) throw new Error("Twitter API request failed");
      const data = await response.json();

      return (
        data.data?.map((user: any) => ({
          id: user.id,
          name: user.name,
          handle: `@${user.username}`,
          platform: "twitter",
          followers: user.public_metrics.followers_count,
          profileImage: user.profile_image_url,
          bio: user.description,
          location: user.location || "Unknown",
          verified: user.verified,
          following: user.public_metrics.following_count,
          tweets: user.public_metrics.tweet_count,
          engagement: calculateTwitterEngagement(user.public_metrics),
        })) || []
      );
    } catch (error) {
      console.error("Twitter search error:", error);
      throw error;
    }
  };

  const calculateEngagementRate = (stats: any) => {
    if (!stats.subscriberCount || stats.subscriberCount === 0) return 0;
    const avgViews = parseInt(stats.viewCount) / parseInt(stats.videoCount);
    return ((avgViews / parseInt(stats.subscriberCount)) * 100).toFixed(1);
  };

  const calculateTwitterEngagement = (metrics: any) => {
    if (!metrics.followers_count || metrics.followers_count === 0) return 0;
    // Simplified engagement calculation
    return ((metrics.tweet_count / metrics.followers_count) * 100).toFixed(1);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    // if (!apiKeys[selectedPlatform]) {
    //   setError(`Please configure ${selectedPlatform} API key first`);
    //   return;
    // }

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      let results = [];

      switch (selectedPlatform) {
        case "instagram":
          results = await searchInstagramUsers(searchTerm);
          break;
        case "youtube":
          results = await searchYouTubeChannels(searchTerm);
          break;
        case "twitter":
          results = await searchTwitterUsers(searchTerm);
          break;
        default:
          throw new Error("Invalid platform selected");
      }

      setSearchResults(results);
    } catch (error: any) {
      setError(`Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyChange = (platform: any, key: any) => {
    setApiKeys((prev) => ({
      ...prev,
      [platform]: key,
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-500" />;
      case "twitter":
        return <Twitter className="w-5 h-5 text-blue-500" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Social Media Influencer Finder
          </h1>
          <p className="text-gray-600 text-lg">
            Find and analyze real influencers across Instagram, YouTube, and
            Twitter
          </p>
        </div>

        {/* API Configuration */}
        {showApiSetup && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                API Configuration
              </h2>
              <button
                onClick={() => setShowApiSetup(!showApiSetup)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showApiSetup ? "Hide" : "Show"} Setup
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram Access Token</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Instagram API token"
                  value={apiKeys.instagram}
                  onChange={(e) =>
                    handleApiKeyChange("instagram", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>YouTube API Key</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter YouTube API key"
                  value={apiKeys.youtube}
                  onChange={(e) =>
                    handleApiKeyChange("youtube", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Twitter className="w-4 h-4 text-blue-500" />
                  <span>Twitter Bearer Token</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Twitter bearer token"
                  value={apiKeys.twitter}
                  onChange={(e) =>
                    handleApiKeyChange("twitter", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                API Setup Instructions:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • <strong>Instagram:</strong> Get access token from Instagram
                  Basic Display API
                </li>
                <li>
                  • <strong>YouTube:</strong> Create API key in Google Cloud
                  Console with YouTube Data API v3
                </li>
                <li>
                  • <strong>Twitter:</strong> Get Bearer Token from Twitter
                  Developer Portal
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for influencers, keywords, or hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={selectedPlatform}
                onChange={(e) =>
                  setSelectedPlatform(e.target.value as Platform)
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{loading ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Search Results ({searchResults.length} found)
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((influencer: any) => (
                <div
                  key={influencer.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={influencer.profileImage}
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {influencer.name}
                        </h3>
                        <p className="text-gray-600">{influencer.handle}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getPlatformIcon(influencer.platform)}
                          {influencer.verified && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {influencer.bio}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {formatNumber(influencer.followers)}
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {influencer.engagement}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>

                    {influencer.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{influencer.location}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex space-x-4 text-sm text-gray-600">
                        {influencer.totalVideos && (
                          <span>
                            {formatNumber(influencer.totalVideos)} videos
                          </span>
                        )}
                        {influencer.totalViews && (
                          <span>
                            {formatNumber(influencer.totalViews)} views
                          </span>
                        )}
                        {influencer.tweets && (
                          <span>{formatNumber(influencer.tweets)} tweets</span>
                        )}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Ready to Find Influencers
            </h3>
            <p className="text-gray-500 mb-6">
              Configure your API keys above and start searching for influencers
              across social media platforms
            </p>
            <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="font-medium text-gray-800 mb-3">Search Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>
                  • Use specific keywords related to niches (e.g., "fitness",
                  "tech", "beauty")
                </li>
                <li>• Search by username or handle for specific influencers</li>
                <li>
                  • Try hashtag searches for Instagram to find related content
                  creators
                </li>
                <li>
                  • YouTube searches work best with channel names or topics
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaInfluencerFinder;
