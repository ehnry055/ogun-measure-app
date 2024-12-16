import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../styles/DataPage.css'; // Import the CSS file for this page

const DataPage = () => {
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: '',
    },
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

  return (
    <div className="data-container">
      {/* Header */}
      <div className="data-header">
        <button className="data-button view-button">View</button>
        <button className="data-button compare-button">Compare</button>
      </div>

      {/* Content Layout */}
      <div className="data-content">
        {/* Table */}
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Data Field</th>
                <th>#</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#5cb85c' }}>Gov_Attn</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td style={{ color: '#f49ac1' }}>Geo_Dist</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td style={{ color: '#f0ad4e' }}>Pub_Fund</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Large Chart */}
        <div className="data-chart">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DataPage;
