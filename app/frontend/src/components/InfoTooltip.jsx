import React, { useState } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="info-tooltip-container">
      <div 
        className="info-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        i
      </div>
      {showTooltip && (
        <div className="info-tooltip">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip; 