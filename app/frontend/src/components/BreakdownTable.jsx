import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import InfoTooltip from './InfoTooltip';

export default function BreakdownTable({ data }) {
  const [breakdownData, setBreakdownData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'average_usage', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const { theme } = useTheme();
  
  useEffect(() => {
    if (data && data.breakdown && Array.isArray(data.breakdown)) {
      setBreakdownData(data.breakdown);
    }
  }, [data]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getClassForStatus = (status) => {
    switch (status) {
      case 'above average':
        return 'above-average';
      case 'below average':
        return 'below-average';
      default:
        return 'average';
    }
  };

  const filteredData = filterStatus === 'all' 
    ? breakdownData 
    : breakdownData.filter(item => item.status === filterStatus);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (!data || !data.breakdown) {
    return <p>No breakdown data available</p>;
  }

  return (
    <div className={`breakdown-container ${theme}`}>
      <div className="controls">
        <div className="title-container">
          <h3 className="title">Appliance Usage Breakdown</h3>
          <div className="title-info">
            <InfoTooltip text="This table shows how much electricity each of your appliances uses. Items highlighted in red use more energy than average and could be costing you extra money. Green items use less energy than average - great job! You can click on any column header to sort the table, and use the buttons below to filter by usage level." />
          </div>
        </div>
        <div className="filter-controls">
          <span>Filter by status: </span>
          <div className="button-group">
            <button 
              className={filterStatus === 'all' ? 'active' : ''} 
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={filterStatus === 'above average' ? 'active' : ''} 
              onClick={() => setFilterStatus('above average')}
            >
              Above Average
            </button>
            <button 
              className={filterStatus === 'average' ? 'active' : ''} 
              onClick={() => setFilterStatus('average')}
            >
              Average
            </button>
            <button 
              className={filterStatus === 'below average' ? 'active' : ''} 
              onClick={() => setFilterStatus('below average')}
            >
              Below Average
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('appliance')}>
                Appliance
                {sortConfig.key === 'appliance' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('average_usage')}>
                Average Usage (kW)
                {sortConfig.key === 'average_usage' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('status')}>
                Status
                {sortConfig.key === 'status' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className={getClassForStatus(item.status)}>
                <td>{item.appliance}</td>
                <td>{item.average_usage.toFixed(2)}</td>
                <td className="status-cell">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .breakdown-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          padding-bottom: 10px;
          transition: all 0.3s ease;
        }
        
        .breakdown-container.light {
          color: #333;
        }
        
        .breakdown-container.dark {
          color: #e2e8f0;
        }
        
        .controls {
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background-color 0.3s ease;
        }
        
        .light .controls {
          background: #f8f9fa;
        }
        
        .dark .controls {
          background: #1a202c;
        }
        
        .title-container {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .title {
          margin: 0;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }
        
        .light .title {
          color: #333;
        }
        
        .dark .title {
          color: #e2e8f0;
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .filter-controls span {
          margin-right: 5px;
          font-weight: bold;
        }
        
        .button-group {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .button-group button {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
        }
        
        .light .button-group button {
          border: 1px solid #ddd;
          background: white;
          color: #333;
        }
        
        .dark .button-group button {
          border: 1px solid #4a5568;
          background: #2d3748;
          color: #e2e8f0;
        }
        
        .light .button-group button:hover {
          background: #f0f0f0;
        }
        
        .dark .button-group button:hover {
          background: #4a5568;
        }
        
        .button-group button.active {
          background: #4b70e2;
          color: white;
          border-color: #4b70e2;
        }
        
        .table-container {
          flex: 1;
          overflow-y: auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-height: calc(100% - 80px);
          transition: all 0.3s ease;
        }
        
        .light .table-container {
          background: white;
        }
        
        .dark .table-container {
          background: #2d3748;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        
        th {
          position: sticky;
          top: 0;
          padding: 8px 10px;
          text-align: left;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
          transition: all 0.3s ease;
        }
        
        .light th {
          background: #f8f9fa;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }
        
        .dark th {
          background: #1a202c;
          color: #e2e8f0;
          border-bottom: 2px solid #4a5568;
        }
        
        .light th:hover {
          background: #e9ecef;
        }
        
        .dark th:hover {
          background: #2d3748;
        }
        
        td {
          padding: 6px 10px;
          transition: all 0.3s ease;
        }
        
        .light td {
          border-bottom: 1px solid #dee2e6;
        }
        
        .dark td {
          border-bottom: 1px solid #4a5568;
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        .light tr:hover {
          background: #f1f3f5;
        }
        
        .dark tr:hover {
          background: #3a4a5e;
        }
        
        .light tr.above-average {
          background-color: rgba(255, 99, 132, 0.1);
        }
        
        .light tr.below-average {
          background-color: rgba(75, 192, 192, 0.1);
        }
        
        .light tr.average {
          background-color: rgba(255, 205, 86, 0.1);
        }
        
        .dark tr.above-average {
          background-color: rgba(255, 99, 132, 0.15);
        }
        
        .dark tr.below-average {
          background-color: rgba(75, 192, 192, 0.15);
        }
        
        .dark tr.average {
          background-color: rgba(255, 205, 86, 0.15);
        }
        
        .light tr.above-average:hover {
          background-color: rgba(255, 99, 132, 0.2);
        }
        
        .light tr.below-average:hover {
          background-color: rgba(75, 192, 192, 0.2);
        }
        
        .light tr.average:hover {
          background-color: rgba(255, 205, 86, 0.2);
        }
        
        .dark tr.above-average:hover {
          background-color: rgba(255, 99, 132, 0.25);
        }
        
        .dark tr.below-average:hover {
          background-color: rgba(75, 192, 192, 0.25);
        }
        
        .dark tr.average:hover {
          background-color: rgba(255, 205, 86, 0.25);
        }
        
        .status-cell {
          font-weight: 500;
        }
        
        tr.above-average .status-cell {
          color: #e74c3c;
        }
        
        tr.below-average .status-cell {
          color: #2ecc71;
        }
        
        tr.average .status-cell {
          color: #f39c12;
        }
      `}</style>
    </div>
  );
} 