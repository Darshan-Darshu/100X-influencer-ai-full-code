import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Instagram,
  MapPin,
  MessageSquare,
  Star,
  Youtube,
  TwitterIcon as TikTok,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { extractCreatorsArray } from "@/lib/utils";
import AIOutReachButton from "../AIOutReachButton";
import ViewProfileButton from "../ViewProfileButton";

async function ContentCreators({ query }: { query: string }) {
  const res = await fetch(`${process.env.HOST_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "force-cache",
  });

  const data = await res.json();

  const creators: Creator[] = extractCreatorsArray(data.text);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="h-4 w-4" />;
      case "YouTube":
        return <Youtube className="h-4 w-4" />;
      case "TikTok":
        return <TikTok className="h-4 w-4" />;
      default:
        return null;
    }
  };
  return (
    <Tabs defaultValue="grid" className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <div className="text-sm text-muted-foreground">
          Showing {creators.length} creators
        </div>
      </div>

      <TabsContent value="grid" className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Card
              key={creator.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={creator.avatar || "/placeholder.svg"}
                        alt={creator.name}
                      />
                      <AvatarFallback>
                        {creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {creator.handle}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{creator.rating}</span>
                      </div>
                    </div>
                  </div>
                  {creator.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      {getPlatformIcon(creator.platform)}
                      {creator.platform}
                    </span>
                    <span className="font-medium">{creator.followers}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement</span>
                    <span className="font-medium text-green-600">
                      {creator.engagement}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Category</span>
                    <Badge variant="outline">{creator.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </span>
                    <span className="text-xs">{creator.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Rate Range</span>
                    <span className="font-medium">{creator.rate}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Languages: </span>
                    <span>{creator.languages.join(", ")}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Recent work: </span>
                    <span>{creator.recentWork.slice(0, 2).join(", ")}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <AIOutReachButton name={creator.name} />
                  <ViewProfileButton />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="list" className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={creator.avatar || "/placeholder.svg"}
                          alt={creator.name}
                        />
                        <AvatarFallback>
                          {creator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{creator.name}</h3>
                          {creator.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {creator.handle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          {getPlatformIcon(creator.platform)}
                          <span>{creator.platform}</span>
                        </div>
                        <div className="font-medium">{creator.followers}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-muted-foreground">Engagement</div>
                        <div className="font-medium text-green-600">
                          {creator.engagement}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-muted-foreground">Category</div>
                        <div className="font-medium">{creator.category}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-muted-foreground">Rate</div>
                        <div className="font-medium">{creator.rate}</div>
                      </div>

                      <div className="flex gap-2">
                        {/* <AIOutReachButton name={creator.name} /> */}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default ContentCreators;
