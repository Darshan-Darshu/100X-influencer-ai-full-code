import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Sparkles,
  Instagram,
  Youtube,
  TwitterIcon as TikTok,
  MapPin,
  Star,
  MessageSquare,
} from "lucide-react";
import AISearch from "./AISearch";

export function CreatorDiscoveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creator Discovery</h1>
        <p className="text-muted-foreground">
          Find and connect with the perfect creators for your campaigns using
          AI-powered search
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Creator Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AISearch />
        </CardContent>
      </Card>
    </div>
  );
}
