import React, { useState } from 'react';
import HighchartsMap from 'highcharts/modules/map';
import Highcharts from 'highcharts/highstock';
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
          { name: 'Time Period 1', y: 60, color: '#5cb85c' },
          { name: 'Time Period 2', y: 20, color: '#f49ac1' },
          { name: 'Time Period 3', y: 20, color: '#f0ad4e' },
        ],
      },
    ],
    credits: { enabled: false },
  };

  const barChartOptions = {
    chart: { type: 'column' },
    title: { text: '' },
    xAxis: {
      categories: ['Time Period 1', 'Time Period 2', 'Time Period 3'],
      title: { text: 'Data Fields' },
    },
    yAxis: { title: { text: 'Values' } },
    series: [
      { name: 'racism present', data: [30, 20, 40], color: '#f0ad4e' },
      { name: 'not present', data: [10, 50, 30], color: '#5cb85c' },
      { name: '-999', data: [20, 30, 10], color: '#f49ac1' },
    ],
    credits: { enabled: false },
  };

  const map = {
    chart: { type: 'area' },
    title: { text: 'AZ and NJ data comparison' },
    xAxis: { allowDecimals: false },
    yAxis: { title: { text: 'text' } },
    series: [
      { name: 'AZ', data: [2, 1, 1, 1, 0, 1] },
      { name: 'NJ', data: [-999, -999, 1, 0, 1, 1] }
    ]
};

const highstock = {
  title: {
    text: 'Overall trends over time'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
    }
  ]
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
      <h>this page is currently experimenting with highcharts. We have plans to expand the view and compare to allow for selection of charts</h>
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
              <HighchartsReact highcharts={Highcharts} options={map} />
            </div>
          </div>
        ) : (
          <div className="data-chart">
            <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={highstock} />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default DataPage;
