"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Clock, Calendar, User, Bot, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CallLog {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  duration: string;
  status: "completed" | "missed" | "ongoing";
  conversation: Array<{
    speaker: "user" | "ai";
    message: string;
    timestamp: string;
  }>;
}

function CallLogs({ call }: { call: any }) {
  const router = useRouter();
  const query = useSearchParams();

  const selectedCall = query.get("id");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedCall === call.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={() => router.push(`?id=${call.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <PhoneCall className="h-6 w-6" />
            <div>
              <h1>{call.sid}</h1>
              <p>{call.phoneNumber}</p>
            </div>
          </div>
          {/* <Badge className={getStatusColor(call.status)}>{call.status}</Badge> */}
        </div>

        {/* <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {call.date}
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {call.time}
          </span>
          {call.status !== "missed" && (
            <span className="flex items-center">Duration: {call.duration}</span>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}

export default CallLogs;
