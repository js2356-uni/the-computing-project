import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import "./TipsPanel.css";
import InfoTooltip from './InfoTooltip';

function TipsPanel({ tips }) {
  const [dismissedTips, setDismissedTips] = useState([]);
  const { theme } = useTheme();
  
  const handleDismissTip = (index) => {
    setDismissedTips([...dismissedTips, index]);
  };
  
  const visibleTips = tips.filter((_, index) => !dismissedTips.includes(index));
  
  return (
    <div className={`tips-container ${theme}`}>
      <div className="tips-header">
        <h3 className="tips-title">Energy Saving Tips</h3>
        <InfoTooltip text="Based on your energy usage, we provide personalized suggestions to help you save electricity and reduce your bills. Each tip is tailored to your household's specific patterns. Check the box next to a tip when you've implemented it, and it will be removed from the list so you can focus on new suggestions." />
      </div>
      
      {visibleTips.length === 0 ? (
        <div className="no-tips">
          <p>No tips available yet. Simulate data to get personalized energy saving recommendations.</p>
        </div>
      ) : (
        <div className="tips-list">
          {tips.map((tip, index) => (
            !dismissedTips.includes(index) && (
              <div key={index} className="tip-card">
                <div className="tip-icon"></div>
                <div className="tip-content">
                  <p>{tip}</p>
                </div>
                <div className="tip-dismiss">
                  <label className="dismiss-checkbox">
                    <input 
                      type="checkbox" 
                      onChange={() => handleDismissTip(index)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default TipsPanel;
