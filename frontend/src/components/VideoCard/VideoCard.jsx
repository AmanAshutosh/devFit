import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiPlayCircleFill, RiTimeLine, RiWeightLine } from "react-icons/ri";
import "./VideoCard.css";

const VideoCard = ({ video, exerciseName, onPlay }) => {
  const [imgError, setImgError] = useState(false);
  const title = exerciseName || video?.title || "Workout Video";
  const duration = video?.duration || "";
  const category = video?.category || "";
  const thumbUrl = video?.thumbUrl || (video?.id ? `https://img.youtube.com/vi/${video.id}/mqdefault.jpg` : null);

  return (
    <motion.div
      className="vc-root"
      whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
      onClick={() => onPlay && onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="vc-thumb-wrap">
        {thumbUrl && !imgError ? (
          <img
            src={thumbUrl}
            alt={title}
            className="vc-thumb"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="vc-thumb-fallback">
            <RiWeightLine size={32} />
          </div>
        )}

        {/* Glassmorphism overlay */}
        <div className="vc-overlay">
          <div className="vc-overlay-top">
            {category && <span className="vc-category-pill">{category}</span>}
            {duration && (
              <span className="vc-duration-pill">
                <RiTimeLine size={11} />
                {duration}
              </span>
            )}
          </div>

          <div className="vc-overlay-center">
            <motion.div
              className="vc-play-btn"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <RiPlayCircleFill size={44} />
            </motion.div>
          </div>

          <div className="vc-overlay-bottom">
            <span className="vc-exercise-name">{title}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
