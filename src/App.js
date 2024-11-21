import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
  chart: {
    type: 'pie'
  },
  title: {
    text: 'charts test'
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6]
    }
  ]
};

const App = () => {
  return (
    <div className="container">
      <h1 className="my-4">Hello, Henry! jaja</h1>
      <button className="btn btn-primary">Click Me</button>
    
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default App;