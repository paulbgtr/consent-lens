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

  function getRatingColor(rating: number): string {
    if (rating >= 7) return "bg-green-100 text-green-800";
    if (rating >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to all documents
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {analysis.service_name}
            </h1>
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                {getDocumentTypeDisplay(analysis.document_type)}
              </span>
              {analysis.ai_generated && (
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded ml-2">
                  🤖 AI-generated
                </span>
              )}
            </div>
          </div>
          <div
            className={`text-lg font-semibold px-4 py-2 rounded-full ${getRatingColor(
              analysis.rating
            )}`}
          >
            Privacy Rating: {analysis.rating}/10
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md text-gray-700">
            {analysis.summary}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Key Risks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(risks).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center p-3 rounded-md bg-gray-50"
              >
                <span className="font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    value === "yes"
                      ? "bg-red-100 text-red-800"
                      : value === "no"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center text-gray-500">
          <div>
            <p>Added on: {formatDate(analysis.created_at)}</p>
          </div>
          <a
            href={analysis.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            View Original Document <span className="ml-1">↗️</span>
          </a>
        </div>
      </div>
    </main>
  );
}
