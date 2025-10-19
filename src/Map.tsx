/*import React from 'react';

import{
    GoogleMap,
    withScriptjs,
    withGoogleMap
} from 'react-google-maps';

const Map = (props)=>{
    return(
        <GoogleMap defaultZoom={19} defaultCenter={ meter coordenadas}/>
    );
}

export default withScriptjs(
    withGoogleMap(
        Map
    )
); 

//Donde se vaya a poner
const mapURL = "https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credencials.mapsKey}"

render(){
    return(
        <div>
            <Map 
            googleMapURL = {mapURL}
            containerElement = {<div style={{height: '400px'}}/>}
            mapElement = {<div style={{height: '100 px'}}/>}
            loadingElement = {<p>Cargando</p>}
            />
        </div>
    )
} */

import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { getUserLocation } from "./getUserLocation";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapComponent() {
  const [center, setCenter] = useState({ lat: 19.4326, lng: -99.1332 }); // CDMX por default

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY || "TU_API_KEY_AQUI",
  });

  useEffect(() => {
    (async () => {
      try {
        const [lat, lng] = await getUserLocation();
        setCenter({ lat, lng });
      } catch (e) {
        console.log("No se pudo obtener ubicación, usando default");
      }
    })();
  }, []);

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={19}
        />
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
}

//Agregar mapa
import MapComponent from "./Map";

function algo() {
  return (
    <div>
      <h2>Mapa de mi ubicación</h2>
      <MapComponent />
    </div>
  );
}
