import { MapPin, DollarSign, Building2, ExternalLink } from "lucide-react";
import { JobRecommendation } from "../types/ats.dto";

interface JobCardProps {
  job: JobRecommendation;
  onAnalyze?: (jobId: string) => void;
}

export const JobCard = ({ job, onAnalyze }: JobCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Company Logo Placeholder */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {job.company.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {job.company}
          </p>

          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {job.salary}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.matchScore >= 80
                    ? "bg-green-100 text-green-700"
                    : job.matchScore >= 60
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {job.matchScore}% Match
              </span>
              <span className="text-xs text-gray-400">{job.postedAt}</span>
            </div>

            {onAnalyze && (
              <button
                onClick={() => onAnalyze(job.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Analyze
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
