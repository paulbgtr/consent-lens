"use client";

import { useState } from "react";
import AnalysisCard from "@/components/AnalysisCard";

interface Analysis {
  id: string;
  name: string;
  type: "tos" | "privacy" | "cookie" | "other";
  summary: string;
  risks: string;
  rating: number;
  source_url: string;
  created_at: string;
}

interface FilterState {
  type: string;
  rating: string;
}

export default function FilterableAnalyses({
  initialAnalyses,
}: {
  initialAnalyses: Analysis[];
}) {
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    rating: "",
  });

  // Filter analyses based on selected filters
  const filteredAnalyses = initialAnalyses.filter((analysis) => {
    // Type filter
    if (filters.type && analysis.type !== filters.type) {
      return false;
    }

    // Rating filter
    if (filters.rating) {
      const rating = analysis.rating;
      if (filters.rating === "low" && (rating < 1 || rating > 3)) return false;
      if (filters.rating === "medium" && (rating < 4 || rating > 6))
        return false;
      if (filters.rating === "high" && (rating < 7 || rating > 10))
        return false;
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  return (
    <>
      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Document Type Filters */}
          <div className="flex gap-1">
            {["tos", "privacy", "cookie", "other"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("type", type)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filters.type === type
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Rating Filters */}
          <div className="flex gap-1">
            <button
              onClick={() => handleFilterChange("rating", "low")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filters.rating === "low"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              1-3
            </button>
            <button
              onClick={() => handleFilterChange("rating", "medium")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filters.rating === "medium"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              4-6
            </button>
            <button
              onClick={() => handleFilterChange("rating", "high")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filters.rating === "high"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              7-10
            </button>
          </div>

          {/* Clear Filters Button */}
          {(filters.type || filters.rating) && (
            <button
              onClick={() => setFilters({ type: "", rating: "" })}
              className="px-3 py-1 text-xs rounded-full bg-muted text-foreground hover:bg-muted/80"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnalyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </div>

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-8">
          {initialAnalyses.length === 0 ? (
            <>
              <p className="text-lg">No analysis documents found</p>
              <p className="text-sm">
                The database needs to be populated with analyses first
              </p>
            </>
          ) : (
            <>
              <p className="text-lg">No matching analyses</p>
              <p className="text-sm">
                Try adjusting your filters to see more results
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
