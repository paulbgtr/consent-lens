"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
  name: string;
  type: "tos" | "privacy" | "cookie" | "other";
  summary: string;
  risks: Risks | string;
  rating: number;
  source_url: string;
  created_at: string;
}

// Get document type badge design
function getDocumentBadge(type: string): { label: string; className: string } {
  const types: Record<string, { label: string; className: string }> = {
    tos: {
      label: "ToS",
      className: "bg-muted text-foreground dark:bg-muted dark:text-foreground",
    },
    privacy: {
      label: "Privacy",
      className: "bg-muted text-foreground dark:bg-muted dark:text-foreground",
    },
    cookie: {
      label: "Cookies",
      className: "bg-muted text-foreground dark:bg-muted dark:text-foreground",
    },
    other: {
      label: "Other",
      className: "bg-muted text-foreground dark:bg-muted dark:text-foreground",
    },
  };
  return types[type] || types.other;
}

// Get top risks with simplified display values
function getProcessedRisks(risks: Record<string, string>): {
  name: string;
  value: string;
  severity: "high" | "medium" | "low" | "none";
}[] {
  // Define risk mappings for display
  const riskMappings: Record<
    string,
    {
      displayName: string;
      severityMap: Record<string, "high" | "medium" | "low" | "none">;
    }
  > = {
    ads: {
      displayName: "Advertising",
      severityMap: {
        yes: "high",
        no: "none",
        limited: "medium",
        passive: "low",
      },
    },
    third_parties: {
      displayName: "3rd Party Sharing",
      severityMap: {
        yes: "high",
        no: "none",
        limited: "medium",
        passive: "low",
      },
    },
    location_tracking: {
      displayName: "Location Tracking",
      severityMap: {
        yes: "high",
        no: "none",
        limited: "medium",
        passive: "low",
      },
    },
    data_collection: {
      displayName: "Data Collection",
      severityMap: {
        yes: "high",
        no: "none",
        limited: "medium",
        passive: "low",
      },
    },
    data_sharing: {
      displayName: "Data Sharing",
      severityMap: {
        yes: "high",
        no: "none",
        limited: "medium",
        passive: "low",
      },
    },
  };

  // Priority order for risks
  const priorityOrder = [
    "ads",
    "third_parties",
    "location_tracking",
    "data_collection",
    "data_sharing",
  ];

  // Process and sort risks
  return Object.entries(risks)
    .map(([key, value]) => {
      const mapping = riskMappings[key] || {
        displayName: key.replace(/_/g, " "),
        severityMap: {
          yes: "high",
          no: "none",
          limited: "medium",
          passive: "low",
        },
      };

      return {
        name: mapping.displayName,
        value: String(value),
        severity: mapping.severityMap[String(value)] || "medium",
      };
    })
    .sort((a, b) => {
      // Show high severity risks first
      if (a.severity === "high" && b.severity !== "high") return -1;
      if (a.severity !== "high" && b.severity === "high") return 1;

      // Then follow priority order
      const indexA = priorityOrder.indexOf(
        a.name.toLowerCase().replace(/\s/g, "_")
      );
      const indexB = priorityOrder.indexOf(
        b.name.toLowerCase().replace(/\s/g, "_")
      );

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    })
    .slice(0, 3); // Only top 3 risks
}

// Get rating display details
function getRatingDisplay(rating: number): {
  color: string;
  label: string;
  barWidthClass: string;
} {
  if (rating >= 8)
    return {
      color: "bg-foreground",
      label: "Good",
      barWidthClass: "w-full",
    };
  if (rating >= 6)
    return {
      color: "bg-foreground",
      label: "Acceptable",
      barWidthClass: "w-3/4",
    };
  if (rating >= 4)
    return {
      color: "bg-foreground",
      label: "Concerning",
      barWidthClass: "w-1/2",
    };
  if (rating >= 2)
    return {
      color: "bg-foreground",
      label: "Poor",
      barWidthClass: "w-1/4",
    };
  return {
    color: "bg-foreground",
    label: "Risky",
    barWidthClass: "w-[10%]",
  };
}

// Get severity indicator classes
function getSeverityClasses(severity: "high" | "medium" | "low" | "none"): {
  dotColor: string;
  textColor: string;
} {
  switch (severity) {
    case "high":
      return {
        dotColor: "bg-foreground",
        textColor: "text-foreground",
      };
    case "medium":
      return {
        dotColor: "bg-foreground",
        textColor: "text-foreground",
      };
    case "low":
      return {
        dotColor: "bg-foreground",
        textColor: "text-foreground",
      };
    case "none":
      return {
        dotColor: "bg-foreground",
        textColor: "text-foreground",
      };
  }
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

  const processedRisks = getProcessedRisks(risks);
  const documentBadge = getDocumentBadge(analysis.type);
  const ratingDisplay = getRatingDisplay(analysis.rating);

  return (
    <Link href={`/document/${analysis.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-sm overflow-hidden">
        {/* Service Brand Bar - Visual Indicator */}
        <div className={`h-1 w-full ${ratingDisplay.color}`}></div>

        <CardHeader className="px-4 py-3 gap-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{analysis.name}</CardTitle>

            <div className="flex items-center gap-1.5">
              <span className="bg-muted text-foreground text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded">
                {documentBadge.label}
              </span>
            </div>
          </div>

          <CardDescription className="line-clamp-2 text-xs">
            {analysis.summary}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 py-2 space-y-3">
          {/* Rating Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-xs">
                  {ratingDisplay.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({analysis.rating}/10)
                </span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${ratingDisplay.color} ${ratingDisplay.barWidthClass}`}
              ></div>
            </div>
          </div>

          {/* Top Risks Section */}
          {processedRisks.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5">
              {processedRisks.map((risk, index) => {
                const severityClasses = getSeverityClasses(risk.severity);
                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${severityClasses.dotColor}`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${severityClasses.textColor}`}
                    >
                      {risk.name}: {risk.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Source Link */}
          {analysis.source_url && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  analysis.source_url,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="text-xs font-medium text-foreground hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Source
            </button>
          )}
        </CardContent>

        <CardFooter className="px-4 py-2 mt-auto border-t border-muted justify-between">
          <time
            dateTime={analysis.created_at}
            className="text-[10px] text-muted-foreground"
          >
            {formatDate(analysis.created_at)}
          </time>
          <span className="text-[10px] text-muted-foreground">
            View details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
