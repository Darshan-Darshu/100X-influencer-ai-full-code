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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";

const mockCampaigns = [
  {
    id: 1,
    name: "Summer Fashion Collection",
    influencer: "Sarah Johnson",
    username: "@fashionista_sarah",
    status: "active",
    budget: 1500,
    spent: 500,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    posts: 3,
    engagement: 4.2,
    contractSigned: true,
    paymentStatus: "partial",
  },
  {
    id: 2,
    name: "Tech Product Review",
    influencer: "Mike Chen",
    username: "@tech_reviewer_mike",
    status: "negotiating",
    budget: 2000,
    spent: 0,
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    posts: 0,
    engagement: 0,
    contractSigned: false,
    paymentStatus: "pending",
  },
  {
    id: 3,
    name: "Fitness Challenge",
    influencer: "Emma Wilson",
    username: "@fitness_emma",
    status: "completed",
    budget: 800,
    spent: 800,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    posts: 5,
    engagement: 5.1,
    contractSigned: true,
    paymentStatus: "paid",
  },
  {
    id: 4,
    name: "Food Brand Partnership",
    influencer: "David Rodriguez",
    username: "@foodie_david",
    status: "pending",
    budget: 3000,
    spent: 0,
    startDate: "2024-02-15",
    endDate: "2024-03-15",
    posts: 0,
    engagement: 0,
    contractSigned: false,
    paymentStatus: "pending",
  },
];

const campaignData = [
  { month: "Oct", campaigns: 8, budget: 12000, spent: 9500 },
  { month: "Nov", campaigns: 12, budget: 18000, spent: 15200 },
  { month: "Dec", campaigns: 15, budget: 22000, spent: 19800 },
  { month: "Jan", campaigns: 18, budget: 28000, spent: 24500 },
  { month: "Feb", campaigns: 14, budget: 25000, spent: 21000 },
];

const statusData = [
  { name: "Active", value: 35, color: "#10b981" },
  { name: "Negotiating", value: 25, color: "#f59e0b" },
  { name: "Pending", value: 20, color: "#6b7280" },
  { name: "Completed", value: 20, color: "#8b5cf6" },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.influencer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "negotiating":
        return "bg-yellow-500";
      case "pending":
        return "bg-gray-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "pending":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your campaigns, contracts, and payments
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Campaigns
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,200</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contracts Signed
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                75% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,500</div>
              <p className="text-xs text-muted-foreground">5 payments due</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns or influencers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns List */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Track and manage all your influencer campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge
                              className={`${getStatusColor(
                                campaign.status
                              )} text-white`}
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Influencer:</span>{" "}
                              {campaign.influencer}
                            </div>
                            <div>
                              <span className="font-medium">Budget:</span> $
                              {campaign.budget.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Spent:</span> $
                              {campaign.spent.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Posts:</span>{" "}
                              {campaign.posts}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Management</CardTitle>
                <CardDescription>
                  Track contract status and signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {campaign.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Influencer: {campaign.influencer}</span>
                            <span>
                              Budget: ${campaign.budget.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            {campaign.contractSigned ? (
                              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                            )}
                            <span className="text-xs">
                              {campaign.contractSigned ? "Signed" : "Pending"}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            {campaign.contractSigned
                              ? "View Contract"
                              : "Send Contract"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>
                  Track payments and financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {campaign.name}
                          </h3>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Influencer:
                              </span>
                              <div className="font-medium">
                                {campaign.influencer}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Amount:
                              </span>
                              <div className="font-medium">
                                ${campaign.budget.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <div
                                className={`font-medium ${getPaymentStatusColor(
                                  campaign.paymentStatus
                                )}`}
                              >
                                {campaign.paymentStatus}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {campaign.paymentStatus === "pending" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Process Payment
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>
                    Budget vs spending over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="budget"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Budget"
                      />
                      <Line
                        type="monotone"
                        dataKey="spent"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Spent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Status Distribution</CardTitle>
                  <CardDescription>
                    Current status of all campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({
                          name,
                          percent,
                        }: {
                          name: any;
                          percent: any;
                        }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>
                  Important performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-muted-foreground">
                      Contract Success Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-muted-foreground">
                      Avg Engagement Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      $1,250
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Campaign Cost
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-muted-foreground">
                      Active Partnerships
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
