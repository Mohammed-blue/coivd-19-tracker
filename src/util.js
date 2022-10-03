import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

// allows our circles to be colored based on caseType
const casesTypeColors = {
    cases: {
        hex: '#fb4443',
        multiplier: 130, // Circle size
    },
    recovered: {
        hex: '#7dd71d',
        multiplier: 130,
    },
    deaths: {
        hex: '#CC1034',
        multiplier: 1000,
    }
}

export const sortData = (data) => {
    const sortedData = [...data]; //copy data

    // sortedData.sort((a,b) => {
    //     if (a.cases > b.cases ) {
    //         return -1; //false
    //     } else {
    //         return 1; //true
    //     }
    // })
    // return sortedData;

    return sortedData.sort((a,b) =>  a.cases > b.cases ? -1 : 1 )
    // return sortedData.sort((a,b) =>  b.cases - a.cases)
};

// puts our cases into a pretty numeral format.
export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// Draw circles on the map with interactive tooltip:
export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                        // # of cases
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format('0,0')}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format('0,0')}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format('0,0')}</div>
                </div>
            </Popup>
        </Circle>
    ))
)