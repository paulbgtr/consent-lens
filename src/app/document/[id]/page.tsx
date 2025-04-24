import { createClient } from "@/lib/actions/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

// Format date in a way that's consistent between server and client
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!analysis) {
    return notFound();
  }

  function getRatingColor(): string {
    return "bg-muted text-foreground";
  }

  function getDocumentTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      tos: "Terms of Service",
      privacy: "Privacy Policy",
      cookie: "Cookie Policy",
      other: "Other Document",
    };
    return types[type] || "Document";
  }

  // Parse risks from JSON string if needed
  const risks =
    typeof analysis.risks === "string"
      ? JSON.parse(analysis.risks)
      : analysis.risks || {};

  return (
    <main className="px-4 sm:px-6 py-6">
      <Link href="/" className="hover:underline mb-4 inline-block text-sm">
        ← Back to all documents
      </Link>

      <div className="bg-card rounded-lg shadow-sm p-5 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{analysis.name}</h1>
            <div className="mt-1.5">
              <span className="inline-block bg-muted text-foreground text-xs px-2 py-0.5 rounded">
                {getDocumentTypeDisplay(analysis.type)}
              </span>
            </div>
          </div>
          <div
            className={`text-base font-semibold px-3 py-1.5 rounded-full ${getRatingColor()}`}
          >
            Privacy Rating: {analysis.rating}/10
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="bg-muted p-3 rounded-md text-sm">
            {analysis.summary}
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2">Key Risks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(risks).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center p-2 rounded-md bg-muted"
              >
                <span className="font-medium capitalize text-sm">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-3 flex justify-between items-center">
          <div>
            <p className="text-xs">
              Added on: {formatDate(analysis.created_at)}
            </p>
          </div>
          <a
            href={analysis.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded text-sm flex items-center"
          >
            View Original <span className="ml-1">↗️</span>
          </a>
        </div>
      </div>
    </main>
  );
}
