import React from "react";
import { useResumeStore } from "../store/resume.store";

export function TemplateSelector() {
  const selectedTemplate = useResumeStore(s => s.selectedTemplate);
  const setTemplate = useResumeStore(s => s.setTemplate);

  const templates = [
    { id: "modern", label: "Modern", icon: "📑" },
    { id: "classic", label: "Classic", icon: "📄" },
    { id: "creative", label: "Creative", icon: "🎨" },
    { id: "simple", label: "Simple", icon: "📝" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1a56db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Popular Templates
        </h3>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={[
              "flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[13px] font-semibold border transition-all",
              selectedTemplate === t.id
                ? "bg-[#1a56db] text-white border-[#1a56db] shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            ].join(" ")}
          >
            <span className="opacity-80">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Visual Preview Box */}
      <div className="relative w-full aspect-[1/1.2] bg-[#F0F4F8] rounded-xl border border-gray-200 overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 p-3 shadow-inner">
          {/* Mock Template Preview */}
          <div className="w-full h-full border border-gray-200 bg-white shadow-sm rounded flex flex-col p-3">
            <div className="w-10 h-10 bg-[#e8f3ff] rounded-full mb-2"></div>
            <div className="w-2/3 h-2 bg-gray-200 rounded mb-1"></div>
            <div className="w-1/2 h-1.5 bg-gray-100 rounded mb-4"></div>
            
            <div className="w-full h-1.5 bg-[#1a56db]/20 rounded mb-2"></div>
            <div className="w-full h-1.5 bg-gray-100 rounded mb-1"></div>
            <div className="w-4/5 h-1.5 bg-gray-100 rounded mb-4"></div>
            
            <div className="w-1/3 h-1.5 bg-[#1a56db]/20 rounded mb-2"></div>
            <div className="w-full h-1.5 bg-gray-100 rounded mb-1"></div>
            <div className="w-full h-1.5 bg-gray-100 rounded mb-1"></div>
            <div className="w-3/4 h-1.5 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[#1a56db]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            Preview {templates.find(t => t.id === selectedTemplate)?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
