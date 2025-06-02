"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Heart,
  MessageCircle,
  Share,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import NegotiationModal from "@/components/NegotiationModal";

const mockInfluencer = {
  id: 1,
  name: "Sarah Johnson",
  username: "@fashionista_sarah",
  platform: "Instagram",
  followers: 125000,
  engagement: 4.2,
  category: "Fashion & Beauty",
  location: "Los Angeles, CA",
  avatar: "/placeholder.svg?height=120&width=120",
  cover: "/placeholder.svg?height=200&width=800",
  verified: true,
  rate: "$500-1000",
  bio: "Fashion enthusiast & lifestyle blogger. Sharing daily outfits, beauty tips, and lifestyle content. Collaborating with brands worldwide. 💄✨",
  joinDate: "March 2020",
  avgLikes: 5200,
  avgComments: 180,
  avgShares: 45,
  recentPosts: 24,
  responseRate: 95,
  avgResponseTime: "2 hours",
};

const engagementData = [
  { month: "Jan", engagement: 3.8, followers: 98000 },
  { month: "Feb", engagement: 4.1, followers: 105000 },
  { month: "Mar", engagement: 3.9, followers: 112000 },
  { month: "Apr", engagement: 4.3, followers: 118000 },
  { month: "May", engagement: 4.2, followers: 125000 },
  { month: "Jun", engagement: 4.5, followers: 125000 },
];

const postPerformance = [
  { type: "Photos", avgLikes: 5200, avgComments: 180 },
  { type: "Videos", avgLikes: 7800, avgComments: 320 },
  { type: "Stories", avgLikes: 3100, avgComments: 95 },
  { type: "Reels", avgLikes: 12500, avgComments: 450 },
];

const recentPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    likes: 6200,
    comments: 234,
    date: "2 days ago",
    type: "Photo",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    likes: 8900,
    comments: 456,
    date: "4 days ago",
    type: "Reel",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=200",
    likes: 4100,
    comments: 123,
    date: "1 week ago",
    type: "Photo",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=200",
    likes: 7300,
    comments: 289,
    date: "1 week ago",
    type: "Video",
  },
];

export default function InfluencerProfilePage() {
  const [showNegotiation, setShowNegotiation] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg" />
          </div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{mockInfluencer.name}</h1>
                  {mockInfluencer.verified && (
                    <Badge className="bg-blue-500">✓ Verified</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {mockInfluencer.username}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mockInfluencer.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {mockInfluencer.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button onClick={() => setShowNegotiation(true)}>
                  Start Negotiation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {mockInfluencer.followers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {mockInfluencer.engagement}%
              </div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {mockInfluencer.avgLikes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Avg Likes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockInfluencer.rate}</div>
              <div className="text-sm text-muted-foreground">Rate Range</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{mockInfluencer.bio}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Category:
                      </span>
                      <Badge variant="secondary">
                        {mockInfluencer.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Platform:
                      </span>
                      <span className="text-sm font-medium">
                        {mockInfluencer.platform}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Response Rate:
                      </span>
                      <span className="text-sm font-medium">
                        {mockInfluencer.responseRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Avg Response Time:
                      </span>
                      <span className="text-sm font-medium">
                        {mockInfluencer.avgResponseTime}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Average Likes</span>
                      </div>
                      <span className="font-medium">
                        {mockInfluencer.avgLikes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Average Comments</span>
                      </div>
                      <span className="font-medium">
                        {mockInfluencer.avgComments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Average Shares</span>
                      </div>
                      <span className="font-medium">
                        {mockInfluencer.avgShares}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Posts (30 days)</span>
                      </div>
                      <span className="font-medium">
                        {mockInfluencer.recentPosts}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trend</CardTitle>
                  <CardDescription>
                    Monthly engagement rate over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Post Performance</CardTitle>
                  <CardDescription>
                    Average performance by content type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={postPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgLikes" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>
                  Follower count growth over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="followers"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>
                  Latest content from {mockInfluencer.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <div className="relative">
                        <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <Badge className="absolute top-2 left-2 text-xs">
                          {post.type}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3 text-blue-500" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {post.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Age and gender breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>18-24 years</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>25-34 years</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>35-44 years</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>45+ years</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: "5%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                  <CardDescription>
                    Where the audience is located
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">United States</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Canada</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">United Kingdom</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Australia</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Germany</span>
                      <span className="text-sm font-medium">6%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other</span>
                      <span className="text-sm font-medium">14%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <NegotiationModal
          isOpen={showNegotiation}
          onClose={() => setShowNegotiation(false)}
          influencer={mockInfluencer.name}
        />
      </div>
    </DashboardLayout>
  );
}
