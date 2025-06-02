import ContentCreators from "@/components/ContentCreators/ContentCreators";
import { CreatorDiscoveryPage } from "@/components/CreatorDiscoveryPage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Suspense } from "react";

async function SearchPage({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  return (
    <DashboardLayout>
      <CreatorDiscoveryPage />
      <Suspense fallback={<h1>Loading</h1>}>
        <ContentCreators query={query} />
      </Suspense>
    </DashboardLayout>
  );
}

export default SearchPage;
