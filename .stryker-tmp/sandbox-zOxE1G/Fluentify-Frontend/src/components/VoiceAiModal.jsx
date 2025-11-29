// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, X, Volume2, Loader } from 'lucide-react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { createRetellCall } from '../api/retell';

const VoiceAIModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState('');
  
  const retellClientRef = useRef(null);

  // Initialize Retell client
  useEffect(() => {
    if (!isOpen) return;

    const retellClient = new RetellWebClient();
    retellClientRef.current = retellClient;

    // Set up event listeners
    retellClient.on('call_started', () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    retellClient.on('agent_start_talking', () => {
      setIsAgentSpeaking(true);
    });

    retellClient.on('agent_stop_talking', () => {
      setIsAgentSpeaking(false);
    });

    retellClient.on('call_ended', () => {
      setIsConnected(false);
      setIsAgentSpeaking(false);
    });

    retellClient.on('error', (error) => {
      setError('Connection error. Please try again.');
      setIsConnecting(false);
      setIsConnected(false);
    });

    retellClient.on('update', (update) => {
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, [isOpen]);

  // Start conversation
  const startCall = async () => {
    if (!retellClientRef.current) return;

    setIsConnecting(true);
    setError('');

    try {
      // Get agent ID from environment
      const agentId = import.meta.env.VITE_RETELL_AGENT_ID;
      
      // Validate agent ID is configured
      if (!agentId) {
        throw {
          status: 400,
          message: '⚠️ Retell Agent ID is not configured. Please add VITE_RETELL_AGENT_ID to your .env file.'
        };
      }
      
      // Step 1: Get access token from backend
      const response = await createRetellCall(agentId);
      
      if (!response.success || !response.data.accessToken) {
        throw new Error('Failed to get access token');
      }
      
      const { accessToken } = response.data;
      
      // Step 2: Start call with access token
      await retellClientRef.current.startCall({
        accessToken: accessToken,
        sampleRate: 24000,
      });
      
    } catch (err) {
      console.error('Failed to start conversation:', err);
      
      // Handle specific error cases
      let errorMessage = 'Failed to connect. Please try again.';
      
      if (err.status === 500 && err.message?.includes('not configured')) {
        errorMessage = '⚠️ Retell AI is not configured. Please contact administrator.';
      } else if (err.status === 401) {
        errorMessage = '🔒 Authentication failed. Please log in again.';
      } else if (err.status === 400) {
        errorMessage = '❌ Invalid configuration. Please contact administrator.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsConnecting(false);
    }
  };

  // End conversation
  const endCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    setIsConnected(false);
    setIsAgentSpeaking(false);
    onClose();
  };

  // Toggle mute
  const toggleMute = () => {
    if (retellClientRef.current) {
      if (isMuted) {
        // Unmute the microphone
        retellClientRef.current.unmute();
        setIsMuted(false);
      } else {
        // Mute the microphone
        retellClientRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950/95 rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-2">AI Tutor</h2>
          <p className="text-sm text-slate-300">
            {isConnected ? 'Connected - Start speaking!' : 'Connect to start your conversation'}
          </p>
        </div>

        {/* Visual Indicator */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer pulsing ring when AI is speaking */}
            {isAgentSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full bg-teal-400 opacity-30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 animate-pulse" style={{ animationDelay: '150ms' }} />
              </>
            )}
            
            {/* Main circle */}
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? isAgentSpeaking 
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-300' 
                  : 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-300'
                : 'bg-gradient-to-br from-orange-400 to-teal-400 shadow-lg shadow-teal-200'
            }`}>
              {isConnecting ? (
                <Loader className="w-12 h-12 text-white animate-spin" />
              ) : isAgentSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-pulse" />
              ) : isConnected ? (
                <Mic className="w-12 h-12 text-white" />
              ) : (
                <Phone className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-6">
          {isConnecting && (
            <p className="text-sm text-slate-300 animate-pulse">Connecting to AI tutor...</p>
          )}
          {isConnected && !isAgentSpeaking && (
            <p className="text-sm text-emerald-300 font-medium">🎙️ Listening...</p>
          )}
          {isAgentSpeaking && (
            <p className="text-sm text-cyan-300 font-medium animate-pulse">🗣️ AI is speaking...</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/60 rounded-lg">
            <p className="text-sm text-red-200 text-center">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={startCall}
              disabled={isConnecting}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-full font-semibold hover:from-teal-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </button>
          ) : (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all shadow-lg ${
                  isMuted 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Phone className="w-5 h-5 rotate-135" />
                End Call
              </button>
            </>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-white/10">
          <p className="text-xs text-slate-200 text-center">
            💡 Practice speaking naturally. Your AI tutor will help you improve pronunciation, fluency, and confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAIModal;
