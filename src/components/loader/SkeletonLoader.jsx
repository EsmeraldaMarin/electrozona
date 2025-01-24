import React from "react";
import "./SkeletonLoader.css"; // Archivo CSS para estilos

const SkeletonLoader = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
};

export default SkeletonLoader;
