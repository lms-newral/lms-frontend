"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

interface SummaryData {
  summary: string;
  keyPoints: string[];
  topics: string[];
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
}

interface NotesSummaryProps {
  noteId: string;
}

const NotesSummary: React.FC<NotesSummaryProps> = ({ noteId }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keyPoints: true,
    topics: true,
    stats: false,
  });

  // Dummy data - replace with actual API call

  useEffect(() => {
    // Simulate API call
    const fetchSummary = async () => {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/summarizeNote/${noteId}`
      );

      setSummaryData(response.data);
      setLoading(false);
    };

    fetchSummary();
  }, [noteId]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    suffix?: string;
  }> = ({ icon, label, value, suffix = "" }) => (
    <div className="rounded-lg p-4 border border-blue-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg text-blue-500">{icon}</div>
        <div>
          <p className="text-sm text-black font-medium">{label}</p>
          <p className="text-lg font-bold text-blue-900">
            {value}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );

  const SectionHeader: React.FC<{
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    count?: number;
  }> = ({ title, icon, isExpanded, onToggle, count }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-blue-50  rounded-lg hover:from-blue-50   transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold">{title}</span>
        {count && (
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
            {count}
          </span>
        )}
      </div>
      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-blue-100 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-blue-50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <div className="text-center py-12">
          <FileText className="mx-auto text-blue-300 mb-4" size={48} />
          <p className="text-blue-600 font-medium">No summary data available</p>
          <p className="text-blue-400 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-blue-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📝 Notes Summary
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<FileText size={20} />}
          label="Original Length"
          value={summaryData.originalLength.toLocaleString()}
          suffix=" chars"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Compression Ratio"
          value={summaryData.compressionRatio}
          suffix="%"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Reading Time"
          value={Math.ceil(summaryData.summaryLength / 200)}
          suffix=" min"
        />
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <SectionHeader
          title="Summary"
          icon={<BookOpen size={20} />}
          isExpanded={expandedSections.summary}
          onToggle={() => toggleSection("summary")}
        />
        {expandedSections.summary && (
          <div className="mt-4 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-800 leading-relaxed text-justify">
              {summaryData.summary}
            </p>
          </div>
        )}
      </div>

      {/* Key Points Section */}
      <div className="mb-6">
        <SectionHeader
          title="Key Points"
          icon={<Target size={20} />}
          isExpanded={expandedSections.keyPoints}
          onToggle={() => toggleSection("keyPoints")}
          count={summaryData.keyPoints.length}
        />
        {expandedSections.keyPoints && (
          <div className="mt-4 p-6  rounded-lg border border-blue-200">
            <ul className="space-y-3">
              {summaryData.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Topics Section */}
      <div className="mb-6">
        <SectionHeader
          title="Topics Covered"
          icon={<BookOpen size={20} />}
          isExpanded={expandedSections.topics}
          onToggle={() => toggleSection("topics")}
          count={summaryData.topics.length}
        />
        {expandedSections.topics && (
          <div className="mt-4 p-6   rounded-lg border border-blue-200">
            <div className="flex flex-wrap gap-2">
              {summaryData.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors cursor-default"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Stats Section */}
      <div>
        <SectionHeader
          title="Detailed Statistics"
          icon={<TrendingUp size={20} />}
          isExpanded={expandedSections.stats}
          onToggle={() => toggleSection("stats")}
        />
        {expandedSections.stats && (
          <div className="mt-4 p-6  rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">
                  Content Analysis
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Characters:</span>
                    <span className="font-medium text-gray-900">
                      {summaryData.originalLength.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Summary Characters:</span>
                    <span className="font-medium text-gray-900">
                      {summaryData.summaryLength.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compression Achieved:</span>
                    <span className="font-medium text-gray-900">
                      {summaryData.compressionRatio}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">
                  Summary Quality
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Key Points Extracted:</span>
                    <span className="font-medium text-gray-900">
                      {summaryData.keyPoints.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Topics Identified:</span>
                    <span className="font-medium text-gray-900">
                      {summaryData.topics.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Estimated Reading Time:
                    </span>
                    <span className="font-medium text-gray-900">
                      {Math.ceil(summaryData.summaryLength / 200)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSummary;
