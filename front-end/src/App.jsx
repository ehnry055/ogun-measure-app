import React from 'react';
import NotesList from './components/NotesList';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS
import { render } from 'react-dom';
import HighchartsMap from 'highcharts/modules/map';
import Highcharts, { chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import Profile from './components/profile';
import USMapData from '@highcharts/map-collection/countries/us/us-all-all.geo.json';


const options = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
},
title: {
    text: 'Browser market shares in May, 2020',
    align: 'left'
},
tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
},
accessibility: {
    point: {
        valueSuffix: '%'
    }
},
plotOptions: {
    pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
    }
},

credits: {
    enabled: false
},

series: [{
    name: 'Brands',
    colorByPoint: true,
    data: [{
        name: 'Chrome',
        y: 70.67,
        sliced: true,
        selected: true
    }, {
        name: 'Edge',
        y: 14.77
    },  {
        name: 'Firefox',
        y: 4.86
    }, {
        name: 'Safari',
        y: 2.63
    }, {
        name: 'Internet Explorer',
        y: 1.53
    },  {
        name: 'Opera',
        y: 1.40
    }, {
        name: 'Sogou Explorer',
        y: 0.84
    }, {
        name: 'QQ',
        y: 0.51
    }, {
        name: 'Other',
        y: 2.6
    }]
}]
};

const map = {
    chart: { type: 'area' },
    title: { text: 'US and USSR nuclear stockpiles' },
    xAxis: { allowDecimals: false },
    yAxis: { title: { text: 'Nuclear weapon states' } },
    series: [
      { name: 'USA', data: [2, 9, 13, 50, 170, 299] },
      { name: 'USSR/Russia', data: [null, null, 1, 5, 25, 50] }
    ]
  };

HighchartsMap(Highcharts);

const App = () => {
  const { isLoading, error } = useAuth0();

  return (
    <div>
    <div className="container">
        <LoginButton />
        <LogoutButton />
        <Profile />

        <h1 className="my-4">Hello, Henry! Data Visualization</h1>
        <button className="btn btn-primary">Click Me</button>
    
        <HighchartsReact highcharts={Highcharts} options={options} />
        <HighchartsReact highcharts={Highcharts} options={map} />
        <NotesList />
    </div>
    </div>
  );
};



export default App;