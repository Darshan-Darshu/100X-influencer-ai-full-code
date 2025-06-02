"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

function ShowFilter() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [followerRange, setFollowerRange] = useState([10000, 1000000]);

  const searchParams = useSearchParams();

  const filter = searchParams.get("filter");
  return (
    <div>
      {filter && (
        <div className="mt-6 flex gap-6 items-center justify-around pt-4 border-t">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Platform</label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Fashion & Beauty">
                  Fashion & Beauty
                </SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Health & Fitness">
                  Health & Fitness
                </SelectItem>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">
              Followers: {followerRange[0].toLocaleString()} -{" "}
              {followerRange[1].toLocaleString()}
            </label>
            <Slider
              value={followerRange}
              onValueChange={setFollowerRange}
              max={1000000}
              min={1000}
              step={1000}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowFilter;
