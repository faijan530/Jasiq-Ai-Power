import { useMemo } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Award, Sparkles } from 'lucide-react';
import { MatchScoreLabel } from '../types/jdMatch.types';

interface MatchScoreCardProps {
  score: number;
  jobTitle?: string;
}

export function MatchScoreCard({ score, jobTitle }: MatchScoreCardProps) {
  const { label, color, icon: Icon, badgeColor, badgeBg } = useMemo(() => {
    let label: MatchScoreLabel;
    let color: string;
    let badgeColor: string;
    let badgeBg: string;
    let icon: typeof CheckCircle2;

    if (score >= 80) {
      label = 'Excellent';
      color = 'text-green-500';
      badgeColor = 'text-green-700';
      badgeBg = 'bg-green-100';
      icon = CheckCircle2;
    } else if (score >= 60) {
      label = 'Good';
      color = 'text-blue-500';
      badgeColor = 'text-blue-700';
      badgeBg = 'bg-blue-100';
      icon = CheckCircle2;
    } else if (score >= 40) {
      label = 'Average';
      color = 'text-yellow-500';
      badgeColor = 'text-yellow-700';
      badgeBg = 'bg-yellow-100';
      icon = AlertCircle;
    } else {
      label = 'Needs Improvement';
      color = 'text-red-500';
      badgeColor = 'text-red-700';
      badgeBg = 'bg-red-100';
      icon = XCircle;
    }

    return { label, color, badgeColor, badgeBg, icon };
  }, [score]);

  // Calculate SVG circle properties
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine gradient colors based on score
  const gradientColors = useMemo(() => {
    if (score >= 80) return ['#10B981', '#059669'];
    if (score >= 60) return ['#3B82F6', '#2563EB'];
    if (score >= 40) return ['#F59E0B', '#D97706'];
    return ['#EF4444', '#DC2626'];
  }, [score]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Score Circle */}
        <div className="relative flex-shrink-0">
          <svg width="220" height="220" className="transform -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Background circle */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              filter="url(#glow)"
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-400 font-medium mb-1">Match Score</span>
            <span className={`text-5xl font-bold ${color}`}>{score}</span>
            <span className="text-sm text-gray-400 mt-1">/ 100</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 text-center md:text-left">
          {/* Dynamic Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${badgeBg} ${badgeColor} mb-3`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
          
          <p className="mt-2 text-gray-600 leading-relaxed">
            {score >= 80
              ? 'Great match! Your resume aligns well with this job.'
              : score >= 60
              ? 'Good match. Consider adding more relevant keywords.'
              : score >= 40
              ? 'Average match. There are areas for improvement.'
              : 'This role may not be the best fit for your current resume.'}
          </p>

          <p className="mt-3 text-sm text-gray-500 italic">
            This score represents how well your resume matches the job description
          </p>

          {jobTitle && (
            <div className="mt-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg inline-block">
              <span className="text-sm text-gray-500">Position:</span>
              <span className="ml-2 text-sm font-medium text-gray-800">{jobTitle}</span>
            </div>
          )}

          {/* Score Breakdown Legend */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700 font-medium">80-100 Excellent</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700 font-medium">60-79 Good</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-700 font-medium">40-59 Average</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-700 font-medium">0-39 Needs Work</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchScoreCard;
