import { useState } from "react";
import { useAuthStore } from "../../auth/store/auth.store";
import { BarChart3, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ATSResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function ATSPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    
    // Mock evaluation - replace with actual API call when ready
    setTimeout(() => {
      setResult({
        score: 85,
        strengths: ["Clear structure", "Relevant keywords", "Good formatting"],
        weaknesses: ["Missing some skills", "Could improve summary"],
        suggestions: ["Add more action verbs", "Quantify achievements"],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">ATS Analyzer</h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Analyze your resume for Applicant Tracking System (ATS) compatibility. 
          Get insights on keyword matching, formatting, and improvement suggestions.
        </p>

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">ATS Score</h2>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-blue-600">{result.score}%</div>
              <div className="text-gray-600">
                {result.score >= 80 ? "Excellent!" : result.score >= 60 ? "Good" : "Needs Improvement"}
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Strengths
            </h2>
            <ul className="space-y-2">
              {result.strengths.map((strength, i) => (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Areas to Improve
            </h2>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness, i) => (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-amber-600 mt-1">!</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
