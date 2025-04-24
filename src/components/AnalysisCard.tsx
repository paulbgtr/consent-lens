"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

type RiskLevel = "yes" | "no" | "passive" | "limited" | string;

interface Risks {
  ads?: RiskLevel;
  third_parties?: RiskLevel;
  location_tracking?: RiskLevel;
  [key: string]: RiskLevel | undefined;
}

interface Analysis {
  id: string;
  service_name: string;
  document_type: "tos" | "privacy" | "cookie" | "other";
  summary: string;
  risks: Risks | string;
  rating: number;
  source_url: string;
  ai_generated: boolean;
  created_at: string;
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

// Format date in a way that's consistent between server and client
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  // Parse risks from JSON string if needed
  const risks =
    typeof analysis.risks === "string"
      ? JSON.parse(analysis.risks)
      : analysis.risks || {};

  return (
    <Link href={`/document/${analysis.id}`} className="block">
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {analysis.service_name}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {getDocumentTypeDisplay(analysis.document_type)}
            </span>
            {analysis.ai_generated && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <span className="mr-1">🤖</span>
                <span>AI-generated</span>
              </span>
            )}
          </CardDescription>
          <CardAction>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${getRatingColor(
                analysis.rating
              )}`}
            >
              {analysis.rating}/10
            </span>
          </CardAction>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 mb-4 line-clamp-3">{analysis.summary}</p>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Key Risks:
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(risks).map(([key, value]) => (
                <span
                  key={key}
                  className={`text-xs px-2 py-1 rounded-full ${
                    value === "yes"
                      ? "bg-red-100 text-red-800"
                      : value === "no"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {key.replace(/_/g, " ")}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between text-sm text-gray-500 border-t">
          <span>{formatDate(analysis.created_at)}</span>
          <div
            onClick={(e) => {
              e.preventDefault();
              window.open(analysis.source_url, "_blank", "noopener,noreferrer");
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Source <span className="ml-1">↗️</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
