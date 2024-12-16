import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../styles/DataPage.css'; 

const DataPage = () => {
  const [isCompareMode, setIsCompareMode] = useState(false);

  const pieChartOptions = {
    chart: { type: 'pie' },
    title: { text: '' },
    series: [
      {
        name: 'Data',
        colorByPoint: true,
        data: [
          { name: 'Gov_Attn', y: 60, color: '#5cb85c' },
          { name: 'Geo_Dist', y: 20, color: '#f49ac1' },
          { name: 'Pub_Fund', y: 20, color: '#f0ad4e' },
        ],
      },
    ],
    credits: { enabled: false },
  };

  const barChartOptions = {
    chart: { type: 'column' },
    title: { text: '' },
    xAxis: {
      categories: ['Field 1', 'Field 2', 'Field 3'],
      title: { text: 'Data Fields' },
    },
    yAxis: { title: { text: 'Values' } },
    series: [
      { name: 'Field A', data: [30, 20, 40], color: '#f0ad4e' },
      { name: 'Field B', data: [10, 50, 30], color: '#5cb85c' },
      { name: 'Field C', data: [20, 30, 10], color: '#f49ac1' },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="data-container">
      <div className="data-header">
        <button
          className={`data-button ${!isCompareMode ? 'active' : ''}`}
          onClick={() => setIsCompareMode(false)}
        >
          View
        </button>
        <button
          className={`data-button ${isCompareMode ? 'active' : ''}`}
          onClick={() => setIsCompareMode(true)}
        >
          Compare
        </button>
      </div>

      <div className="data-content">
        {isCompareMode ? (
          <div className="compare-section">
            <div className="field-selectors">
              {[1, 2, 3, 4].map((_, index) => (
                <div className="field-selector" key={index}>
                  <select>
                    <option>Select Field</option>
                    <option>Field A</option>
                    <option>Field B</option>
                    <option>Field C</option>
                  </select>
                  <span className="eye-icon">👁</span>
                  <span className="remove-icon">✖</span>
                </div>
              ))}
            </div>
            <div className="data-chart">
              <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
            </div>
          </div>
        ) : (
          <div className="data-chart">
            <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPage;
