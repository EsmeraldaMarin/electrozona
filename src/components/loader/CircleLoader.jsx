import React from "react";
import "./CircleLoader.scss";

const CircleLoader = ({ texto = "" }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      {texto && <p className="mt-3">{texto}</p>}
    </div>
  );
};

export default CircleLoader;