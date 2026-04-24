import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Analyzing your resume against the job description...' }: LoadingStateProps) {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-purple-500 animate-bounce" />
      </div>
      
      <h3 className="mt-6 text-lg font-semibold text-gray-800">Processing Analysis</h3>
      <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">{message}</p>
      
      <div className="mt-6 flex gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default LoadingState;
