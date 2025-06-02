"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "./ui/input";

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: any;
}

function NegotiationModal({
  isOpen,
  onClose,
  influencer,
}: NegotiationModalProps) {
  const [formData, setFormData] = useState({
    campaignType: "",
    budget: "",
    deliverables: "",
    phoneNumber: "",
    timeline: "",
    requirements: "",
    additionalNotes: "",
  });

  const aiWillCallInfluencerHandler = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: formData.phoneNumber }),
    });

    const data = await res.json();

    console.log(data);

    return data;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = () => {
    // Simulate AI negotiation
    // alert(
    //   "AI negotiation initiated! You'll receive a response within 24 hours."
    // );
    onClose();

    aiWillCallInfluencerHandler();
    setFormData({
      campaignType: "",
      budget: "",
      deliverables: "",
      timeline: "",
      phoneNumber: "",
      requirements: "",
      additionalNotes: "",
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI Negotiation with {influencer}</span>
          </DialogTitle>
          <DialogDescription>
            Let our AI handle the negotiation process for you. Fill in your
            requirements and we'll create a personalized proposal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campaign Details</h3>

            <div className="space-y-2">
              <Label htmlFor="campaignType">Campaign Type</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("campaignType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsored-post">Sponsored Post</SelectItem>
                  <SelectItem value="product-review">Product Review</SelectItem>
                  <SelectItem value="brand-partnership">
                    Brand Partnership
                  </SelectItem>
                  <SelectItem value="event-coverage">Event Coverage</SelectItem>
                  <SelectItem value="giveaway">Giveaway/Contest</SelectItem>
                  <SelectItem value="long-term">
                    Long-term Collaboration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select
                onValueChange={(value) => handleInputChange("budget", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10000+">$10,000+</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Deliverables</Label>
              <Textarea
                id="deliverables"
                placeholder="Describe what you expect (e.g., 3 Instagram posts, 5 stories, 1 reel...)"
                value={formData.deliverables}
                onChange={(e) =>
                  handleInputChange("deliverables", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <p className="text-[12px] text-gray-600">
                  since we are using mock data, currently we need to enter
                  manually later it will be automatic (please enter 91 before
                  your number) 91XXXXXXXXXXX
                </p>
              </div>
              <Input
                id="phone-number"
                placeholder="Enter the Phone number for now to test"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                type="number"
              />
            </div>
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {"Cancel"}
            </Button>

            <Button onClick={handleSubmit}>{"Start AI Negotiation"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NegotiationModal;
