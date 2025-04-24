import { Suspense } from "react";
import FilterableAnalyses from "@/components/FilterableAnalyses";
import { createClient } from "@/lib/actions/supabase";

export default async function Home() {
  const supabase = await createClient();
  const { data: analyses } = await supabase.from("analyses").select();

  return (
    <main className="px-4 sm:px-6 py-6">
      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold">Understanding our ratings</h2>
            <p className="text-sm">
              <span className="inline-block bg-muted text-foreground px-2 py-0.5 rounded-full text-xs mr-2">
                1-3
              </span>{" "}
              Concerning
              <span className="inline-block bg-muted text-foreground px-2 py-0.5 rounded-full text-xs mx-2">
                4-6
              </span>{" "}
              Average
              <span className="inline-block bg-muted text-foreground px-2 py-0.5 rounded-full text-xs ml-2">
                7-10
              </span>{" "}
              Respects privacy
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={<div className="text-center py-8">Loading analyses...</div>}
      >
        <FilterableAnalyses initialAnalyses={analyses || []} />
      </Suspense>
    </main>
  );
}
