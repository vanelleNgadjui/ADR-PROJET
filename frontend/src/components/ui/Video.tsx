import React from "react";

type AspectRatio = "video" | "square" | "4/3" | "16/9" | "21/9";

interface VideoProps {
  src: string;
  title?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  containerClassName?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  poster?: string;
}

interface IframeVideoProps {
  src: string;
  title?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  containerClassName?: string;
  allowFullScreen?: boolean;
}

// Composant pour les vidéos HTML5
const Video: React.FC<VideoProps> = ({
  src,
  title = "Video",
  aspectRatio = "video",
  className = "",
  containerClassName = "",
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
  poster
}) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square", 
    "4/3": "aspect-4/3",
    "16/9": "aspect-video", // aspect-video is 16/9
    "21/9": "aspect-[21/9]"
  };

  return (
    <div className={`${aspectClasses[aspectRatio]} overflow-hidden rounded-lg ${containerClassName}`}>
      <video
        src={src}
        title={title}
        autoPlay={autoplay}
        muted={muted}
        controls={controls}
        loop={loop}
        poster={poster}
        className={`w-full h-full object-cover ${className}`}
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
};

// Composant pour les vidéos iframe (YouTube, Vimeo, etc.)
const IframeVideo: React.FC<IframeVideoProps> = ({
  src,
  title = "Embedded Video",
  aspectRatio = "video",
  className = "",
  containerClassName = "",
  allowFullScreen = true
}) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    "4/3": "aspect-4/3", 
    "16/9": "aspect-video",
    "21/9": "aspect-[21/9]"
  };

  return (
    <div className={`${aspectClasses[aspectRatio]} overflow-hidden rounded-lg ${containerClassName}`}>
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={allowFullScreen}
        className={`w-full h-full ${className}`}
      ></iframe>
    </div>
  );
};

// Composants spécifiques pour différents ratios (compatibilité avec le template)
const VideoSixteenToNine: React.FC<Omit<IframeVideoProps, 'aspectRatio'>> = (props) => (
  <IframeVideo {...props} aspectRatio="16/9" />
);

const VideoFourToThree: React.FC<Omit<IframeVideoProps, 'aspectRatio'>> = (props) => (
  <IframeVideo {...props} aspectRatio="4/3" />
);

const VideoOneToOne: React.FC<Omit<IframeVideoProps, 'aspectRatio'>> = (props) => (
  <IframeVideo {...props} aspectRatio="square" />
);

const VideoTwentyOneToNine: React.FC<Omit<IframeVideoProps, 'aspectRatio'>> = (props) => (
  <IframeVideo {...props} aspectRatio="21/9" />
);

export { 
  Video, 
  IframeVideo, 
  VideoSixteenToNine, 
  VideoFourToThree, 
  VideoOneToOne, 
  VideoTwentyOneToNine 
};
