import React from "react";
import "./TikTokLoader.css";

const TikTokLoader = () => {
  return (
    <div className="tiktok-loader-wrapper">
      <div className="tiktok-loader">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default TikTokLoader;