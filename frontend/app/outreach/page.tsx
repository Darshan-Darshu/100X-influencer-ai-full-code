import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import CallLogs from "@/components/CallLogs";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

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

async function AIOutReachPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;

  console.log(id);

  const { data: sampleCallLogs, error } = await supabase
    .from("calllogs")
    .select("*");

  if (!sampleCallLogs) return;

  const callLogsData = sampleCallLogs.find((call) => call.id === +id);

  console.log(callLogsData);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50">
        <div className="w-1/2 border-r bg-white">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
            <p className="text-gray-600 mt-1">Recent customer interactions</p>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4 space-y-3">
              {sampleCallLogs
                .filter((call) => call.logs !== null)
                .map((call: any) => (
                  <Suspense key={call.id} fallback={<h1>Loading</h1>}>
                    <CallLogs call={call} />
                  </Suspense>
                ))}
            </div>
          </ScrollArea>
        </div>

        {callLogsData && (
          <div className="w-1/2 bg-white">
            <p>{callLogsData.logs}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AIOutReachPage;
