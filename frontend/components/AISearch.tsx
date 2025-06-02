import { Filter, Search, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

function AISearch() {
  const handleAiSearch = async (formdata: FormData) => {
    "use server";
    const query = formdata.get("query")?.toString();

    if (!query) return;

    redirect(`/search/${query}`);
  };
  return (
    <div>
      <div className=" flex flex-col lg:flex-row gap-4">
        <form action={handleAiSearch} className="flex-1 relative">
          <Input
            placeholder="Search influencers by name, username, or category..."
            name="query"
            className="pl-4"
          />
          <button
            type="submit"
            className="absolute right-2 top-[1%] -translate-y-1/2 bg-transparent text-muted-foreground cursor-pointer"
          >
            <Search className="absolute right-3 top-[10px] h-4 w-4 text-muted-foreground" />
          </button>
        </form>

        <Button
          variant="outline"
          // onClick={() => redirect("?filter=true")}
          className="lg:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* <FilterSearch /> */}
    </div>
  );
}

export default AISearch;
