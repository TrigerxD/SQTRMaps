import React from 'react'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import Control from 'react-leaflet-control';

const aeiLat = 50.28868461815858
const aeiLng = 18.67756247520447

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            latitude: aeiLat,
            longitude: aeiLng,
        }
        this.getMyLocation = this.getMyLocation.bind(this)
        this.newMarkerPosition = this.newMarkerPosition.bind(this);
        this.sendLocalization = this.sendLocalization.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.getMyLocation()
    }

    newMarkerPosition(e) {
        const {lat, lng} = e.latlng;
        this.setState({
            latitude: lat,
            longitude: lng,
        });
    }

    sendLocalization() {
        console.log('Sending loc to server: ' + this.state.latitude + ' ' + this.state.longitude);
    }

    login() {
        console.log('Log in');
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            }, (error) => {
                this.setState({latitude: aeiLat, longitude: aeiLng})
            })
        }

    }

    render() {
        const {latitude, longitude} = this.state
        const geoLocation = [latitude, longitude]
        return (
            <Map center={geoLocation} zoom={17} maxZoom={19} onClick={this.newMarkerPosition}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <Control position="topright">
                    <button onClick={this.sendLocalization}>
                        Wyślij lokalizację
                    </button>
                </Control>

                <Control position="topright">
                    <button onClick={this.getMyLocation}>
                        Wybierz moją lokalizację
                    </button>
                </Control>

                <Control position="topright">
                    <button onClick={this.login}>
                        Zaloguj się
                    </button>
                </Control>

                <Marker position={geoLocation}>
                    <Popup>Lokalizacja hulajnogi</Popup>
                </Marker>
            </Map>
        );
    }
}

export default App;