import React, { useState } from "react";
import type { CanonicalResumeJson } from "../types/resume.dto";

interface KeywordAssistantProps {
  resumeJson: CanonicalResumeJson;
  onAddKeyword?: (keyword: string) => void;
}

export function KeywordAssistant({ resumeJson, onAddKeyword }: KeywordAssistantProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const currentKeywords = (resumeJson.skills || []).map(s => s.name.toLowerCase());
  
  // Provide all available keywords minus the ones already added
  const availableKeywords = React.useMemo(() => {
    // Standard list of dynamic professional skills
    const pool = [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Git", "AWS",
      "API Integration", "Agile Methodologies", "RESTful APIs", "CI/CD",
      "Full-Stack", "Jira", "Team Leadership", "Docker", "Kubernetes", "GraphQL",
      "Java", "C++", "C#", "Ruby", "Go", "Rust", "PHP", "HTML", "CSS", "TailwindCSS",
      "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Linux",
      "Machine Learning", "Data Analysis", "Project Management", "UI/UX Design"
    ];

    return pool.filter(k => !currentKeywords.includes(k.toLowerCase()));
  }, [currentKeywords]);

  const filteredSuggested = availableKeywords.filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[#1a56db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Keywords Assistant
      </h3>

      <div className="relative mb-4">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search keywords..." 
          className="w-full bg-[#F0F4F8] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] transition-all"
        />
        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Role-specific suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggested.length > 0 ? (
              filteredSuggested.map((keyword, i) => (
                <button
                  key={i}
                  onClick={() => onAddKeyword && onAddKeyword(keyword)}
                  className="px-3 py-1.5 bg-[#e8f3ff] text-[#1a56db] text-xs font-semibold rounded-lg hover:bg-[#1a56db] hover:text-white transition-colors border border-blue-100"
                >
                  + {keyword}
                </button>
              ))
            ) : (
              <span className="text-xs text-gray-500">No suggestions match your search.</span>
            )}
          </div>
        </div>

        {currentKeywords.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Added Keywords
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentKeywords.map((k, i) => (
                <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-md border border-gray-200">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
