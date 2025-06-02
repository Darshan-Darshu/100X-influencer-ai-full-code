type Creator = {
  id: number; // Unique identifier
  name: string; // Full name of the creator
  handle: string; // YouTube channel handle
  platform: "youtube"; // Platform name
  followers: string; // Formatted follower count (e.g., "1.2M")
  engagement: string; // Engagement rate as percentage
  category: string; // Primary content category
  location: string; // Creator's location
  rate: string; // Estimated sponsorship rate
  avatar: string; // Profile image URL
  verified: boolean; // Verification status
  rating: number; // Overall match score (1-10)
  languages: string[]; // Languages they create content in
  recentWork: string[]; // 3 most recent notable collaborations
};
