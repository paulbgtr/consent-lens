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
    <main className="container mx-auto py-8 px-4">
      <Link href="/" className="hover:underline mb-6 inline-block">
        ← Back to all documents
      </Link>

      <div className="bg-card rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{analysis.service_name}</h1>
            <div className="mt-2">
              <span className="inline-block bg-muted text-foreground text-sm px-3 py-1 rounded">
                {getDocumentTypeDisplay(analysis.document_type)}
              </span>
              {analysis.ai_generated && (
                <span className="inline-block bg-muted text-foreground text-sm px-3 py-1 rounded ml-2">
                  🤖 AI-generated
                </span>
              )}
            </div>
          </div>
          <div
            className={`text-lg font-semibold px-4 py-2 rounded-full ${getRatingColor()}`}
          >
            Privacy Rating: {analysis.rating}/10
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          <div className="bg-muted p-4 rounded-md">{analysis.summary}</div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Key Risks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(risks).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center p-3 rounded-md bg-muted"
              >
                <span className="font-medium capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="ml-2 px-2 py-1 rounded-full text-sm bg-muted">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p>Added on: {formatDate(analysis.created_at)}</p>
          </div>
          <a
            href={analysis.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded flex items-center"
          >
            View Original Document <span className="ml-1">↗️</span>
          </a>
        </div>
      </div>
    </main>
  );
}
