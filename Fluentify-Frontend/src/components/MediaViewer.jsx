import React, { useState } from 'react';
import { FileText, Headphones, Video, ExternalLink, Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * MediaViewer Component
 * Displays PDF, Audio, or Video content for lessons
 */
const MediaViewer = ({ mediaUrl, mediaType, title = 'Lesson Content' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  if (!mediaUrl) {
    return null;
  }

  // Determine media type from URL if not provided
  const getMediaType = () => {
    if (mediaType) return mediaType;
    const url = mediaUrl.toLowerCase();
    if (url.endsWith('.pdf')) return 'pdf';
    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) return 'audio';
    if (url.endsWith('.mp4') || url.endsWith('.webm')) return 'video';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'unknown';
  };

  const type = getMediaType();

  // PDF Viewer
  if (type === 'pdf') {
    return (
      <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100">{title}</h4>
              <p className="text-xs text-slate-400">PDF Document</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPdfViewer(!showPdfViewer)}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              {showPdfViewer ? 'Hide' : 'View'} PDF
            </button>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </a>
            <a
              href={mediaUrl}
              download
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
        
        {showPdfViewer && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={`${mediaUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-[600px] bg-white"
              title={title}
            />
          </div>
        )}
      </div>
    );
  }

  // Audio Player
  if (type === 'audio') {
    return (
      <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-100 mb-1">{title}</h4>
            <p className="text-xs text-slate-400 mb-3">Audio Lesson</p>
            <audio
              controls
              className="w-full h-10"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={mediaUrl} type="audio/mpeg" />
              <source src={mediaUrl} type="audio/wav" />
              <source src={mediaUrl} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <a
            href={mediaUrl}
            download
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Video Player
  if (type === 'video') {
    return (
      <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">{title}</h4>
            <p className="text-xs text-slate-400">Video Lesson</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden">
          <video
            controls
            className="w-full"
            poster=""
          >
            <source src={mediaUrl} type="video/mp4" />
            <source src={mediaUrl} type="video/webm" />
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    );
  }

  // YouTube Embed
  if (type === 'youtube') {
    // Extract YouTube video ID
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(mediaUrl);

    if (videoId) {
      return (
        <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100">{title}</h4>
              <p className="text-xs text-slate-400">YouTube Video</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  // Fallback - unknown media type, show link
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">{title}</h4>
            <p className="text-xs text-slate-400">Media Content</p>
          </div>
        </div>
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open Content
        </a>
      </div>
    </div>
  );
};

export default MediaViewer;
