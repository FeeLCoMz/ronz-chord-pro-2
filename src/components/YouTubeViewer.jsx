import React, { useState, useEffect } from 'react';

const YouTubeViewer = ({ videoId }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (!videoId) return;
    
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }
    
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);
  
  const initPlayer = () => {
    if (window.YT && window.YT.Player) {
      const newPlayer = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => setPlayer(event.target),
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          }
        }
      });
    }
  };
  
  const handlePlayPause = () => {
    if (player) {
      isPlaying ? player.pauseVideo() : player.playVideo();
    }
  };
  
  const handleStop = () => {
    if (player) player.stopVideo();
  };
  
  if (!videoId) {
    return (
      <div className="youtube-viewer">
        <div className="no-video">Tidak ada video untuk lagu ini</div>
      </div>
    );
  }
  
  return (
    <div className="youtube-viewer">
      <div className="video-container">
        <div id="youtube-player"></div>
      </div>
      <div className="video-controls">
        <button onClick={handlePlayPause} className="btn btn-secondary">
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={handleStop} className="btn btn-secondary">
          ⏹ Stop
        </button>
      </div>
    </div>
  );
};

export default YouTubeViewer;
