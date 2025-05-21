import React, { useState } from "react";
import TipsPanel from "./components/TipsPanel";
import ForecastGraph from "./components/ForecastGraph";
import BreakdownTable from "./components/BreakdownTable";
import AuthPanel from "./components/AuthPanel";
import SettingsPanel from "./components/SettingsPanel";
import { ThemeProvider, useTheme } from "./ThemeContext";
import './app.css'; // Import regular CSS instead of using styled-jsx

function AppContent() {
  const { theme } = useTheme();
  var isLoggedIn = false; // redundant variable
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tipsData, setTipsData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [breakdownData, setBreakdownData] = useState(null);
  const [costPerKw, setCostPerKw] = useState(0.25); // Default cost per kW
  const unused_variable = "test"; // unused variable

  // This function now receives all the data directly
  function handleApiResults(results) {
    console.log("Received API results:", results);
    
    // Update tips data
    setTipsData(results.tips || []);
    
    // Update cost per kW
    if (results.cost_per_kw) {
      setCostPerKw(results.cost_per_kw);
    }
    
    // Process forecast data if available
    if (results.forecast && Array.isArray(results.forecast)) {
      // Transform the forecast array into the format the ForecastGraph component expects
      const formatted_forecast = results.forecast.map((value, index) => ({
        total_power: value,
        localminute: `Day ${index + 1}`
      }));
      console.log("Setting forecast data:", formatted_forecast);
      setForecastData(formatted_forecast);
    }
    
    // Set breakdown data
    if (results.breakdown) {
      console.log("Setting breakdown data:", results.breakdown);
      setBreakdownData(results.breakdown);
    }
  }

  return (
    <div className={`app-wrapper ${theme}`}>
      <div className={`main-container ${theme}`}>
        {/* Left Column */}
        <div className="left-column">
          <div className="panel auth-panel">
            {isAuthenticated ? (
              <SettingsPanel onSimulate={handleApiResults} />
            ) : (
              <AuthPanel setIsAuthenticated={setIsAuthenticated} />
            )}
          </div>
          <div className="panel tips-panel">
            <TipsPanel tips={tipsData} />
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="panel forecast-graph">
            <ForecastGraph data={forecastData} costPerKw={costPerKw} />
          </div>
          <div className="panel breakdown">
            <BreakdownTable data={breakdownData} costPerKw={costPerKw} />
          </div>
        </div>

        {/* Styles */}
        <style jsx>{`
          .main-container {
            display: flex;
            padding: clamp(16px, 2.5vw, 32px);
            max-width: min(1600px, 98%);
            width: 98%;
            height: min(96vh, 1200px);
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            gap: 24px;
          }
          
          .main-container.light {
            background-color: #f8f9fa;
            color: #1a202c;
            border: 1px solid #e2e8f0;
          }
          
          .main-container.dark {
            background-color: #1a202c;
            color: #f1f5f9;
            border: 1px solid #334155;
          }
          
          .left-column {
            width: clamp(300px, 30%, 450px);
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .panel {
            padding: clamp(16px, 1.5vw, 24px);
            box-sizing: border-box;
            overflow-y: auto;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .auth-panel {
            flex: 1;
          }
          
          .tips-panel {
            flex: 1;
          }
          
          .light .panel {
            border: 1px solid #e2e8f0;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .dark .panel {
            border: 1px solid #334155;
            background-color: #1e293b;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
          }
          
          .right-column {
            flex: 1;
            min-width: 0; /* Prevents flex items from overflowing */
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .forecast-graph {
            flex: 2;
          }
          
          .breakdown {
            flex: 1;
          }
          
          h2 {
            margin-top: 0;
            margin-bottom: 16px;
            font-size: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);
            letter-spacing: -0.025em;
            font-weight: 600;
            font-family: var(--font-display);
          }
          
          .light h2 {
            color: #1a202c;
          }
          
          .dark h2 {
            color: #f1f5f9;
          }
          
          /* Extra large screen optimization */
          @media (min-width: 1600px) {
            .main-container {
              max-width: min(1800px, 90%);
              padding: 32px;
            }
            
            .panel {
              padding: 24px;
            }
          }
          
          /* Responsive adjustments for medium screens */
          @media (max-width: 1024px) {
            .main-container {
              height: auto;
              min-height: 95vh;
              flex-direction: column;
              padding: clamp(16px, 2vw, 24px);
            }
            
            .left-column {
              width: 100%;
              flex-direction: row;
              height: auto;
            }
            
            .panel {
              height: min-content;
            }
            
            .right-column {
              height: auto;
              min-height: 60vh;
            }
          }
          
          /* Responsive adjustments for small screens */
          @media (max-width: 768px) {
            .main-container {
              width: 100%;
              gap: 16px;
              border-radius: 8px;
              padding: 16px;
            }
            
            .left-column {
              flex-direction: column;
              gap: 16px;
            }
          }
          
          /* Responsive adjustments for extra small screens */
          @media (max-width: 640px) {
            .app-wrapper {
              padding: 0;
            }
            
            .main-container {
              width: 100%;
              max-width: 100%;
              border-radius: 0;
              border-left: none;
              border-right: none;
              padding: 12px;
            }
            
            .panel {
              padding: 12px;
              border-radius: 8px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// Wrap the AppContent with ThemeProvider
export default function AppLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
