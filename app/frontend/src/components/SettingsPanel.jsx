import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import InfoTooltip from './InfoTooltip';
import './SettingsPanel.css';

const API_URL = "http://127.0.0.1:8000";
const API_KEY = "myverysecureapikey";

function SettingsPanel({ onSimulate }) {
  const [costPerKw, setCostPerKw] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const appliances = [
    "air1", "air2", "airwindowunit1", "bathroom1", "bedroom1", "car1", "car2", "circpump1",
    "clotheswasher1", "clotheswasher_dryg1", "diningroom1", "dishwasher1", "disposal1", "drye1",
    "freezer1", "furnace1", "furnace2", "garage1", "heater1", "heater2", "heater3", "housefan1",
    "jacuzzi1", "kitchen1", "kitchenapp1", "kitchenapp2", "lights_plugs1", "lights_plugs2",
    "lights_plugs3", "lights_plugs4", "livingroom1", "microwave1", "office1", "oven1", "pump1",
    "range1", "refrigerator1", "sewerpump1", "solar", "solar2", "sumppump1", "utilityroom1",
    "venthood1", "waterheater1", "wellpump1"
  ];

  const simulateData = () => {
    setLoading(true);
    
    const startTime = new Date("2025-01-01T00:00:00");
    const simulatedData = [];
    const costPerKwValue = parseFloat(costPerKw) || 0.25;

    for (let i = 0; i < 1440; i++) {
      const minuteData = { dataid: 123 };
      let totalPower = 0;
      
      appliances.forEach(appliance => {
        const value = Math.random();
        minuteData[appliance] = value;
        totalPower += value; // Sum for total_power
      });
      
      minuteData['total_power'] = totalPower; // Add total_power for the graph
      minuteData['leg1v'] = Math.random();
      minuteData['leg2v'] = Math.random();
      minuteData['minute_offset'] = Math.random();
      minuteData['localminute'] = new Date(startTime.getTime() + i * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      simulatedData.push(minuteData);
    }

    const finalData = {
      data: simulatedData,
      cost_per_kw: costPerKwValue
    };

    sendToExternalAPI(finalData, costPerKwValue);
  };

  // Send simulated data to forecast, breakdown, and tips endpoints
  const sendToExternalAPI = async (simulatedData, costPerKwValue) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      setLoading(false);
      return;
    }

    const results = {};

    for (const endpoint of ["forecast", "breakdown", "tips"]) {
      try {
        console.log(`Calling API endpoint: ${API_URL}/${endpoint}`);
        const response = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(simulatedData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.reload(); 
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`API response for ${endpoint}:`, result);
        
        results[endpoint] = result;
        
        downloadJSON(result, `${endpoint}_result.json`);
      } catch (error) {
        console.error(`Failed to call ${endpoint}:`, error);
      }
    }

    if (onSimulate) {
      onSimulate({
        tips: results.tips?.tips || [],
        forecast: results.forecast?.forecast || [],
        breakdown: results.breakdown || {},
        cost_per_kw: costPerKwValue
      });
    }
    
    setLoading(false);
  };

  const downloadJSON = (data, filename) => {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  
  const connectSmartMeter = () => {
    alert('This feature is not yet available. Coming soon!');
  };

  return (
    <div className={`settings-container ${theme}`}>
      <div className="settings-header">
        <h3 className="title">Energy Dashboard Settings</h3>
        <div className="theme-toggle-container">
          <span className="theme-label">
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={theme === 'dark'} 
              onChange={toggleTheme}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <div className="section-header">
          <h4 className="section-title">Simulation Settings</h4>
          <InfoTooltip text="This demo app creates simulated household energy data for a single day. When you click 'Simulate Full Day Data', the machine learning model analyzes this data to produce an energy forecast, appliance usage breakdown, and personalized tips. Enter your actual electricity cost to see spending predictions for the next month. In a real implementation, this would use your actual historical smart meter data instead of simulations." />
        </div>
        <div className="input-group">
          <label htmlFor="costPerKw">Cost per kW (£)</label>
          <input
            id="costPerKw"
            type="number"
            placeholder="e.g. 0.25"
            value={costPerKw}
            onChange={(e) => setCostPerKw(e.target.value)}
          />
        </div>
        
        <button
          onClick={simulateData}
          className="action-button simulate-button"
          disabled={loading}
        >
          {loading ? 'Simulating...' : 'Simulate Full Day Data'}
          {loading && <span className="loading-spinner"></span>}
        </button>
      </div>
      
      <div className="settings-section">
        <div className="section-header">
          <h4 className="section-title">Smart Meter Integration</h4>
          <InfoTooltip text="In a full production version, this feature would connect directly to your energy provider's smart meter API to access your actual usage data. Instead of using simulated data, the trained model would analyze your real electricity consumption patterns, providing much more accurate forecasts and personalized recommendations. Most energy providers now offer APIs that allow secure access to your smart meter data with your permission." />
        </div>
        <p className="section-description">
          Connect to your home's smart meter to get real-time energy usage data.
        </p>
        <button 
          onClick={connectSmartMeter}
          className="action-button smartmeter-button"
        >
          <span className="icon">📊</span>
          Connect Smart Meter
        </button>
      </div>
      
      <style jsx>{`
        .settings-container {
          height: 100%;
          padding: 1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }
        
        .settings-container.light {
          background: linear-gradient(145deg, #f5f7fa, #e9ecef);
          color: #333;
        }
        
        .settings-container.dark {
          background: linear-gradient(145deg, #2d3748, #1a202c);
          color: #f7fafc;
        }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid;
          border-image: linear-gradient(to right, #4b70e2, transparent) 1;
        }
        
        .title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          background: linear-gradient(135deg, #4b70e2, #2f56d6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .theme-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .theme-label {
          font-size: 1.2rem;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
          background-color: #4b70e2;
        }
        
        input:focus + .toggle-slider {
          box-shadow: 0 0 1px #4b70e2;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }
        
        .settings-section {
          background: rgba(255, 255, 255, 0.08);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .light .settings-section {
          background: rgba(255, 255, 255, 0.8);
        }
        
        .dark .settings-section {
          background: rgba(26, 32, 44, 0.5);
        }
        
        .section-title {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #4b70e2;
        }
        
        .dark .section-title {
          color: #63b3ed;
        }
        
        .section-description {
          font-size: 0.85rem;
          margin: 0 0 1rem 0;
          opacity: 0.8;
        }
        
        .input-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 0.7rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .light input {
          background: #f9f9f9;
          color: #333;
        }
        
        .dark input {
          background: #2d3748;
          border-color: #4a5568;
          color: #f7fafc;
        }
        
        input:focus {
          outline: none;
          border-color: #4b70e2;
          box-shadow: 0 0 0 2px rgba(75, 112, 226, 0.2);
        }
        
        .action-button {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }
        
        .simulate-button {
          background: linear-gradient(135deg, #4b70e2, #2f56d6);
          color: white;
        }
        
        .simulate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(47, 86, 214, 0.3);
        }
        
        .simulate-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .smartmeter-button {
          background: linear-gradient(135deg, #38b2ac, #2c7a7b);
          color: white;
          margin-top: 0.5rem;
        }
        
        .smartmeter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(56, 178, 172, 0.3);
        }
        
        .icon {
          font-size: 1.2rem;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-left: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SettingsPanel;
