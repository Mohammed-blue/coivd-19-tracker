import './App.css';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material'
import { useState, useEffect } from 'react'
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData  } from './util' ;
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css'
import { prettyPrintStat } from './util'
import Logo from '../src/imgs/Covid19Logo.png'
// import numeral from "numeral";



// Used disease.sh API to provide necessary live numbers of COVID-19 cases/recovery/Death
// https://disease.sh/v3/covid-19/countries

// useEffect = Runs a piece of code based on a given condition.



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  // this allows for recovery a response for all counted countries when we select worldwide.
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) =>
        ({
          //getting country and countryInfo from our API call.
          name: country.country, // United States, United Kingdom, etc.
          value: country.countryInfo.iso2 // UK, USA, etc
        }));

        const sortedData = sortData(data);
        // setTableData(data); //data unsorted
        setTableData(sortedData); // data sorted by cases
        setMapCountries(data) //gets all  the countries
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  // this listens to country and sets our dropdown menu to country that is selected.
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log('MEEEEEEEE', countryCode);

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries[country_code]
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode);

      // all of the data...
      // from the country response
      setCountryInfo(data);

      //allows for navigating to country of choice from dropdown menu.
      countryCode === "worldwide"
      ? setMapCenter([34.80746, -40.4796])
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };

  // console.log('COUNTRY INFO >>>>: ', countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        {/* Header  */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
        <img src={Logo} alt="" />
        <FormControl className="app_dropdown">
          <Select variant='outlined' value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem> {/* set default value to dropdown menu */}
            {/* Loop through all the countries and show a dropdown with a list of the options */}

            {
              // this is pulling data from our async API call from useEffect getCountriesData
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
                )
                )
              }

          </Select>
        </FormControl>
        </div>

        <div className="app__stats">
        {/* InfoBox title="Coronavirus cases*/}
        {/* InfoBox title="Coronavirus recoveries" */}
        {/* InfoBox title="Coronavirus deaths" */}
          <InfoBox
            isOrangeRed
            onClick={e => setCasesType('cases')}
            active={casesType === 'cases'}
            title='Coronavirus cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            />

          <InfoBox
            isGreen
            onClick={e => setCasesType('recovered')}
            active={casesType === 'recovered'}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            />

          <InfoBox
            isRed
            onClick={e => setCasesType('deaths')}
            active={casesType === 'deaths'}
            title='Deaths'
            cases= {prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            />

        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3 className="app__liveCasesTable">Live Cases by Country</h3>
          <Table countries={tableData} />
          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph"  casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
