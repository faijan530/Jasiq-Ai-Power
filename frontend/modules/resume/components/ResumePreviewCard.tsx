import { useState } from "react";
import type { CanonicalResumeJson } from "../types/resume.dto";

// Inline SVG icons
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ResumePreviewCardProps {
  resumeJson: CanonicalResumeJson;
  canEdit: boolean;
  onUpdate?: (field: string, value: string) => void;
}

export function ResumePreviewCard({ resumeJson, canEdit, onUpdate }: ResumePreviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(resumeJson.basics.name);

  const handleSave = () => {
    onUpdate?.("basics.name", editName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(resumeJson.basics.name);
    setIsEditing(false);
  };

  const initials = resumeJson.basics.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          {initials || <UserIcon />}
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 text-lg font-bold text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Full Name"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {resumeJson.basics.name || "Untitled Resume"}
              </h2>
              <p className="text-gray-500 text-sm">
                Software Engineer
              </p>
            </>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            {resumeJson.basics.email && (
              <span className="flex items-center gap-1">
                <MailIcon />
                {resumeJson.basics.email}
              </span>
            )}
            {resumeJson.basics.phone && (
              <span className="flex items-center gap-1">
                <PhoneIcon />
                {resumeJson.basics.phone}
              </span>
            )}
            {resumeJson.basics.location && (
              <span className="flex items-center gap-1">
                <MapPinIcon />
                {resumeJson.basics.location}
              </span>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Save"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <XIcon />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <EditIcon />
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
