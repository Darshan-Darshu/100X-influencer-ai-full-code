"use client";

import { useState } from "react";
import NegotiationModal from "./NegotiationModal";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

function AIOutReachButton({ name }: { name: string }) {
  const [showNegotiation, setShowNegotiation] = useState(false);
  console.log(showNegotiation);
  return (
    <div>
      <Button size="sm" onClick={() => setShowNegotiation(true)}>
        <MessageSquare className="h-3 w-3 mr-1" />
        AI Outreach
      </Button>

      <NegotiationModal
        isOpen={showNegotiation}
        onClose={() => setShowNegotiation(false)}
        influencer={name}
      />
    </div>
  );
}

export default AIOutReachButton;
