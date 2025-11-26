import React, { useState } from 'react';
import { Upload, FileText, Video, Headphones, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadLessonMedia } from '../../../../api/admin';

const LessonForm = ({ 
  lessonData, 
  onChange, 
  onSubmit, 
  onCancel, 
  loading = false,
  // Upload context - passed from parent
  uploadContext = null // { language, courseNumber, unitNumber, lessonNumber }
}) => {
  const [keyPhraseInput, setKeyPhraseInput] = useState('');
  const [vocabKey, setVocabKey] = useState('');
  const [vocabValue, setVocabValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ uploading: false, success: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...lessonData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...lessonData,
      [name]: parseInt(value) || 0
    });
  };

  // File Upload Handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Store file info in lessonData
      onChange({
        ...lessonData,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      });

      // If we have upload context, upload immediately
      if (uploadContext) {
        await handleUpload(file);
      }
    }
  };

  // Upload file to server
  const handleUpload = async (file) => {
    if (!uploadContext) {
      setUploadStatus({ uploading: false, success: false, error: 'Upload context not available. Save the lesson first.' });
      return;
    }

    setUploadStatus({ uploading: true, success: false, error: null });

    try {
      const contentType = lessonData.content_type === 'audio' ? 'audio' : 
                          lessonData.content_type === 'video' ? 'video' : 'pdf';

      const result = await uploadLessonMedia(file, {
        language: uploadContext.language,
        courseNumber: uploadContext.courseNumber,
        unitNumber: uploadContext.unitNumber,
        lessonNumber: uploadContext.lessonNumber,
        contentType
      });

      if (result.success) {
        // Update lessonData with the media URL
        onChange({
          ...lessonData,
          media_url: result.data.url,
          file_name: result.data.filename
        });
        setUploadStatus({ 
          uploading: false, 
          success: true, 
          error: null,
          manualUpload: result.data.manualUploadRequired 
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ uploading: false, success: false, error: error.message });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus({ uploading: false, success: false, error: null });
    onChange({
      ...lessonData,
      file_name: null,
      file_size: null,
      file_type: null,
      media_url: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Key Phrases Management
  const addKeyPhrase = () => {
    if (keyPhraseInput.trim()) {
      const currentPhrases = lessonData.key_phrases || [];
      onChange({
        ...lessonData,
        key_phrases: [...currentPhrases, keyPhraseInput.trim()]
      });
      setKeyPhraseInput('');
    }
  };

  const removeKeyPhrase = (index) => {
    const currentPhrases = lessonData.key_phrases || [];
    onChange({
      ...lessonData,
      key_phrases: currentPhrases.filter((_, i) => i !== index)
    });
  };

  // Vocabulary Management
  const addVocabulary = () => {
    if (vocabKey.trim() && vocabValue.trim()) {
      const currentVocab = lessonData.vocabulary || {};
      onChange({
        ...lessonData,
        vocabulary: {
          ...currentVocab,
          [vocabKey.trim()]: vocabValue.trim()
        }
      });
      setVocabKey('');
      setVocabValue('');
    }
  };

  const removeVocabulary = (key) => {
    const currentVocab = lessonData.vocabulary || {};
    const newVocab = { ...currentVocab };
    delete newVocab[key];
    onChange({
      ...lessonData,
      vocabulary: newVocab
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div>
        {/* Title */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lesson Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={lessonData.title || ''}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="e.g., Pronouncing Vowels"
        />
      </div>

      {/* Content Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lesson Type <span className="text-red-500">*</span>
        </label>
        <select
          name="content_type"
          value={lessonData.content_type || ''}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
        >
          <option value="">Select Lesson Type</option>
          <option value="pdf">PDF Document</option>
          <option value="video">Video</option>
          <option value="audio">Audio / Listening Exercise</option>
          <option value="reading">Reading</option>
          <option value="conversation">Conversation</option>
          <option value="grammar">Grammar</option>
          <option value="vocabulary">Vocabulary</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={lessonData.description || ''}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="Describe what students will learn..."
        />
      </div>

      {/* Dynamic Fields Based on Content Type */}
      {lessonData.content_type === 'pdf' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Upload PDF Document <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-white"
          />
          {selectedFile && (
            <div className="mt-2 flex items-center justify-between bg-white p-2 rounded border border-gray-200">
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
              <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">Upload a PDF file for students to read and study</p>
        </div>
      )}

      {lessonData.content_type === 'video' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <Video className="w-4 h-4 inline mr-2" />
            Video Source
          </label>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Video URL (YouTube, Vimeo, etc.)</label>
            <input
              type="url"
              name="media_url"
              value={lessonData.media_url || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-white"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="text-center text-gray-500 text-sm">OR</div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Upload Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-white"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {lessonData.content_type === 'audio' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <Headphones className="w-4 h-4 inline mr-2" />
            Audio / Listening Exercise <span className="text-red-500">*</span>
          </label>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Upload Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-white"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Transcript (Optional)</label>
            <textarea
              name="transcript"
              value={lessonData.transcript || ''}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-white"
              placeholder="Enter the audio transcript here..."
            />
          </div>
        </div>
      )}

      {lessonData.content_type === 'quiz' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Questions
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Use the exercises section below to create quiz questions (Multiple Choice, Fill in the Blanks, Matching Pairs)
          </p>
        </div>
      )}

      {/* Upload Status */}
      {(uploadStatus.uploading || uploadStatus.success || uploadStatus.error) && (
        <div className={`rounded-lg p-3 flex items-center gap-2 ${
          uploadStatus.uploading ? 'bg-blue-50 border border-blue-200' :
          uploadStatus.success ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          {uploadStatus.uploading && (
            <>
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-700">Uploading file...</span>
            </>
          )}
          {uploadStatus.success && (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                {uploadStatus.manualUpload 
                  ? 'URL generated! Please upload the file manually to the server.' 
                  : 'File uploaded successfully!'}
              </span>
            </>
          )}
          {uploadStatus.error && (
            <>
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{uploadStatus.error}</span>
            </>
          )}
        </div>
      )}

      {/* Media URL Display */}
      {lessonData.media_url && (
        <div className="bg-slate-800 rounded-lg p-3">
          <label className="block text-xs text-slate-400 mb-1">Media URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={lessonData.media_url}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(lessonData.media_url)}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* XP Reward */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          XP Reward
        </label>
        <input
          type="number"
          name="xp_reward"
          value={lessonData.xp_reward || 0}
          onChange={handleNumberChange}
          disabled={loading}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="10"
        />
      </div>

      {/* Key Phrases */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Phrases
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keyPhraseInput}
            onChange={(e) => setKeyPhraseInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyPhrase())}
            disabled={loading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Add a key phrase"
          />
          <button
            type="button"
            onClick={addKeyPhrase}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(lessonData.key_phrases || []).map((phrase, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {phrase}
              <button
                type="button"
                onClick={() => removeKeyPhrase(index)}
                disabled={loading}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Vocabulary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vocabulary
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={vocabKey}
            onChange={(e) => setVocabKey(e.target.value)}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
            placeholder="English word"
          />
          <input
            type="text"
            value={vocabValue}
            onChange={(e) => setVocabValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVocabulary())}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-900/40"
            placeholder="Translation"
          />
          <button
            type="button"
            onClick={addVocabulary}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {Object.entries(lessonData.vocabulary || {}).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-slate-100"
            >
              <span className="text-sm">
                <strong>{key}:</strong> {value}
              </span>
              <button
                type="button"
                onClick={() => removeVocabulary(key)}
                disabled={loading}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Lesson'}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;