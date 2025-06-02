import { CreatorDiscoveryPage } from "@/components/CreatorDiscoveryPage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createCall() {
  const call = await client.calls.create({
    from: "+16206478343",
    to: "+919844168308",
    url: "http://demo.twilio.com/docs/voice.xml",
  });

  console.log(call.sid);
}

const func1 = async () => {
  const res = await fetch(`${process.env.HOST_URL}/api/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: "+917899158908" }),
  });

  const data = await res.json();

  return data;
};

export default async function CreatorsPage() {
  // const data = await func1();
  // console.log(data);

  // const array = extractCreatorsArray(data.text);
  // console.log(array);

  return (
    // <h1>{data.text}</h1>
    <DashboardLayout>
      <CreatorDiscoveryPage />
    </DashboardLayout>
  );
}
