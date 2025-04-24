import { createClient } from "@/lib/actions/supabase";
import AnalysisCard from "@/components/AnalysisCard";

export default async function Home() {
  const supabase = await createClient();
  const { data: analyses } = await supabase.from("analyses").select();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Consent Lens 🔍</h1>
        <p className="text-xl max-w-3xl mx-auto">
          We read the fine print so you don't have to. Browse simplified,
          human-readable summaries of Terms of Service and Privacy Policies.
        </p>
      </div>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Understanding our ratings</h2>
            <p>
              <span className="inline-block bg-muted text-foreground px-2 py-1 rounded-full text-sm mr-2">
                1-3
              </span>{" "}
              Concerning
              <span className="inline-block bg-muted text-foreground px-2 py-1 rounded-full text-sm mx-2">
                4-6
              </span>{" "}
              Average
              <span className="inline-block bg-muted text-foreground px-2 py-1 rounded-full text-sm ml-2">
                7-10
              </span>{" "}
              Respects privacy
            </p>
          </div>

          {/* Placeholder for future filtering UI */}
          <div className="text-sm">
            <p>Filtering options will be available soon</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses?.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>

      {analyses?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl">No analysis documents found</p>
          <p>The database needs to be populated with analyses first</p>
        </div>
      )}
    </main>
  );
}
