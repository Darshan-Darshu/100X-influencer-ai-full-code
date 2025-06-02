"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function ViewProfileButton() {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push("/influencer/1")}
    >
      View Profile
    </Button>
  );
}

export default ViewProfileButton;
