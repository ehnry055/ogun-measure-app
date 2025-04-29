import React from 'react';
import '../styles/HomePage.css'; 

function OgunMeasure() {
    return (
    <div className="home-container">
        <h2 className="about-title">Ogun</h2>
        <div className="about-content">
        <table>
        <tr>
            <th></th>
            <th>Historical Period 1<br/> Pre-Civil Rights <br/>1619-1968</th>
            <th>Historical Period 2<br/> Desegregation <br/>1969-1999</th>
            <th>Historical Period 3<br/> Modern Times <br/>2000-present</th>
        </tr>
        <tr>
            <th>Structural Violence</th>
            <td>Counties with a known revolts, race riots, uprisings, and other violent events between 1526-1969</td>
            <td>Counties with a highway known to have dislocated a neighborhood with predominantly residents racialized as Black between 1990-2000</td>
            <td>Counties with higher-than-the-median national occupied housing units with severe housing problems AND higher than residents racialized as Black between 2016-2020</td>
        </tr>
        <tr>
            <th>Limited or Restricted Access</th>
            <td>Counties with a known history of redlining or sundowning practices before 1970</td>
            <td>Counties where the proportion of residents racialized as White was greater than the national proportion for 2 or more of decennial years between 1970-2000</td>
            <td>Counties where the proportion of residents racialized as White was greater than the national proportion for 2010 and 2020 or 2020 only</td>
        </tr>
        </table>
        <div className="container">
        <a className="homebtn"><span> See Measure </span></a>
        <a href="/" className="homebtn"><span> Return Home </span></a>
        </div>
        </div>
    </div>
    );
};

export default OgunMeasure;