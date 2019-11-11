import React from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const position = [50.288706, 18.675072]

function App() {
  return (
      <Map center={position} zoom={17}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>AEiI</Popup>
        </Marker>
      </Map>
  );
}

export default App;
