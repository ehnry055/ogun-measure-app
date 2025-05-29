import React, { useEffect, useState } from 'react';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMapModule from 'highcharts/modules/map';
import mapData from '@highcharts/map-collection/countries/us/us-all-all.topo.json';
import "../styles/MapPage.css";
import InfoPopup from '../components/InfoPopup';

// Initialize the map module
HighchartsMapModule(Highcharts);

const MapPage = () => {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unemployment data
        const response = await fetch("https://ogun-measure-app-4fceb75a4928.herokuapp.com/MapData.json");
        const structuredData = await response.json();

        // Add state acronym for tooltip
        mapData.objects.default.geometries.forEach(g => {
          const properties = g.properties;
          if (properties['hc-key']) {
            properties.name = properties.name + ', ' +
              properties['hc-key'].substr(3, 2).toUpperCase();
          }
        });

        const chartOptions = {
          chart: {
            map: mapData,
            height: '80%',
            backgroundColor: '#8C68CD26',
            borderRadius: 10,
            borderWidth: 2,
            borderColor: 'white'

          },
          title: {
            text: ' ',
            align: 'left',
            style: {
                color: "#ffffff"
            },
            
          },

          accessibility: {
            description: 'Demo showing a large dataset.'
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            margin: 0,
            backgroundColor: '#EEEEEE26',
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 2
          },
          mapNavigation: {
            enabled: true
          },
          colorAxis: {
            itemStyle: {
              color: 'white',
              fontWeight: 'bold'
            },
            color: 'white',
            min: 0,
            max: 25,
            tickInterval: 5,
            stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']],
            labels: {
              format: '{value}'
            }
          },
          plotOptions: {
            mapline: {
              showInLegend: false,
              enableMouseTracking: false
            }
          },
          series: [{
            data: structuredData,
            joinBy: ['hc-key', 'code'],
            name: 'Total Structural Racism',
            tooltip: {
              valueSuffix: ''
            },
            borderWidth: 0.5,
            shadow: false,
            accessibility: {
              enabled: false
            }
          }, {
            type: 'mapline',
            name: 'State borders',
            color: 'white',
            shadow: false,
            borderWidth: 2,
            accessibility: {
              enabled: false
            }
          }]
        };

        setOptions(chartOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='map-display'>
      <h1 className='map-title'>Ogun Measure by County: Total Structural Racism
        <InfoPopup>
        <h2 style={{textAlign: 'center', color: '#8C68CD'}}>Map Display </h2>

          <p style={{ textAlign: 'center' , margin: '0 20px', fontSize: '22px'}}>
            This map displays a heatmap of all US counties based on the total structural racism score as calculated by the Ogun Measure. 
            <brk />
            This value is determined by the cumulative value of all combinations of facets, pathways, and historical periods.
          </p>
        </InfoPopup>
      </h1>
      {options ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'mapChart'}
          options={options}
        />
      ) : (
        <div>Loading map data...</div>
      )}
    </div>
  );
};

export default MapPage;