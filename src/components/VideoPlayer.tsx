import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player/dist/shaka-player.ui';
import 'shaka-player/dist/controls.css';

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
  title?: string;
  token?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onClose, title, token }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let player: any = null;
    let ui: any = null;

    const initPlayer = async () => {
      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        setError('Browser not supported for video playback.');
        return;
      }

      if (!videoRef.current || !videoContainerRef.current) return;

      player = new shaka.Player(videoRef.current);
      playerRef.current = player;

      // Add authorization headers if needed
      if (token) {
        player.getNetworkingEngine()?.registerRequestFilter((type: any, request: any) => {
          // If the player requests an encryption key (AES-128 or similar)
          if (type === shaka.net.NetworkingEngine.RequestType.KEY) {
            // Check if the URL is trying to fetch "enc.key" directly from the CDN
            if (request.uris[0] && request.uris[0].includes('enc.key')) {
               // The user wants us to use the specific PenPencil API route.
               try {
                  const originalUrl = request.uris[0];
                  const urlObj = new URL(originalUrl);
                  
                  // Extract IDs from request URL if possible
                  const parentId = urlObj.searchParams.get('parentId');
                  const childId = urlObj.searchParams.get('childId');
                  const videoId = urlObj.searchParams.get('videoId');
                  
                  // Encode original URL for API call
                  const encodedUrl = encodeURIComponent(originalUrl);
                  
                  let apiRoute = `/api/video-key?url=${encodedUrl}&token=${token}`;
                  if (parentId) apiRoute += `&parentId=${parentId}`;
                  if (childId) apiRoute += `&childId=${childId}`;
                  if (videoId) apiRoute += `&videoId=${videoId}`;
                  
                  request.uris[0] = apiRoute;
               } catch(e) {
                 console.error('Failed to patch key request:', e);
               }
            }
          }
        });
      }

      try {
        await player.load(url);
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } catch (e: any) {
        console.error('Shaka Player Error:', e);
        setError('Error loading video. The video URL may be expired or inaccessible.');
      }
    };

    initPlayer();

    return () => {
      if (player) {
        player.destroy();
      }
      if (ui) {
        ui.destroy();
      }
    };
  }, [url, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="bg-black w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 bg-tertiary-6/10 border-b border-white/10 z-10">
          <h3 className="font-bold text-white line-clamp-1">{title || 'Video Player'}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="relative w-full aspect-video flex-1 bg-black" ref={videoContainerRef}>
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-white p-6 text-center">
              <div className="bg-red-500/20 text-red-200 border border-red-500/30 p-4 rounded-xl">
                {error}
              </div>
            </div>
          ) : (
            <video 
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
