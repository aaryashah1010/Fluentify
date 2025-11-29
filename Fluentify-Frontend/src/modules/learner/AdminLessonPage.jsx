import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Loader2,
} from 'lucide-react';
import {
  useLessonDetails,
} from '../../hooks/useCourses';
import {
  SkeletonPageHeader,
  SkeletonCard,
  SkeletonText,
  MediaViewer,
} from '../../components';

const AdminLessonPage = () => {
  const { courseId, unitId, lessonId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: loading, error: queryError } = useLessonDetails({
    courseId: Number(courseId),
    unitId: Number(unitId),
    lessonId: Number(lessonId),
  });

  const lesson = data?.data?.lesson;
  const error = queryError?.message;

  // Parse media URLs - support both single URL and array of URLs
  const mediaUrls = useMemo(() => {
    if (!lesson?.media_url) return [];
    // If it's already an array, use it directly
    if (Array.isArray(lesson.media_url)) return lesson.media_url;
    // Try parsing as JSON array
    try {
      const parsed = JSON.parse(lesson.media_url);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not JSON, treat as single URL
    }
    // Single URL - wrap in array
    return [lesson.media_url];
  }, [lesson?.media_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Lesson overview */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="space-y-4">
              <SkeletonText lines={2} />
              <div className="flex gap-6 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <div className="text-center bg-slate-900/90 p-8 rounded-2xl max-w-md">
          <p className="text-red-400 mb-4">{error || 'Lesson not found'}</p>
          <button 
            onClick={() => navigate(`/module-course/${courseId}`)}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/module-course/${courseId}`)}
          className="mb-4 inline-flex items-center gap-2 text-sm hover:opacity-80 transition"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200">
            ←
          </span>
          <span className="font-medium text-white">Back to Course</span>
        </button>

        <div className="bg-gradient-to-r from-teal-500 to-orange-400 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/80 mb-1">
                Lesson {lessonId}
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-sm md:text-base text-white/90 mt-2 max-w-xl">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Show file count */}
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/90">
            {mediaUrls.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <BookOpen className="w-4 h-4" />
                <span>{mediaUrls.length} {mediaUrls.length === 1 ? 'file' : 'files'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Media Content Section (PDF, Audio, Video) */}
        {mediaUrls.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Lesson Content {mediaUrls.length > 1 && `(${mediaUrls.length} files)`}
            </h2>
            <div className="space-y-4">
              {mediaUrls.map((url, index) => (
                <MediaViewer 
                  key={index}
                  mediaUrl={url}
                  mediaType={lesson.content_type || lesson.type || lesson.lessonType}
                  title={mediaUrls.length > 1 ? `${lesson.title} - File ${index + 1}` : lesson.title}
                />
              ))}
            </div>
          </section>
        )}

        {mediaUrls.length === 0 && (
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">No content files available for this lesson.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLessonPage;
