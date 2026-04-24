import { User, Briefcase, GraduationCap, FileText, Edit3 } from "lucide-react";

interface ResumePreviewCardProps {
  name?: string;
  role?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  onEdit?: () => void;
}

export const ResumePreviewCard = ({
  name = "John Doe",
  role = "Software Engineer",
  summary = "Experienced software engineer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications.",
  experience = [
    { title: "Senior Developer", company: "Tech Corp", duration: "2020 - Present" },
    { title: "Developer", company: "Startup Inc", duration: "2018 - 2020" },
  ],
  education = [
    { degree: "B.S. Computer Science", school: "University", year: "2018" },
  ],
  onEdit,
}: ResumePreviewCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {name.charAt(0)}
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-blue-100">{role}</p>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div>
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <FileText className="w-4 h-4" />
            <span>Summary</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
            <Briefcase className="w-4 h-4" />
            <span>Experience</span>
          </div>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-blue-200 pl-4">
                <h4 className="font-medium text-gray-900">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-400">{exp.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Education</span>
          </div>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="border-l-2 border-purple-200 pl-4">
                <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-400">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewCard;
