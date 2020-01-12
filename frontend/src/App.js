import React from 'react'
import L from 'leaflet'
import {Map, Marker, Popup, TileLayer, LayerGroup} from 'react-leaflet'
import Control from 'react-leaflet-control';
import R from 'react-dom'
import {Login} from "./Login";
import {Captcha} from "./Captcha";
import {MarkersView} from "./markers";
import {PopupboxManager} from "react-popupbox";

const aeiLat = 50.28868461815858;
const aeiLng = 18.67756247520447;

const userIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            latitude: aeiLat,
            longitude: aeiLng,
            access_token: '',
            refresh_token: '',
            markers: [[aeiLat, aeiLng]],
            data: []
        };
        this.getMyLocation = this.getMyLocation.bind(this);
        this.newMarkerPosition = this.newMarkerPosition.bind(this);
        this.sendLocalization = this.sendLocalization.bind(this);
        this.showPrettyInfo = this.showPrettyInfo.bind(this);
    }

    componentDidMount() {
        this.getMyLocation()
        this.state.isLoading = false;
    }

    newMarkerPosition(e) {
        const {lat, lng} = e.latlng;
        this.setState({
            latitude: lat,
            longitude: lng,
            markers: [[lat, lng]]
        });
    }

    sendLocalization() {
        console.log('Sending loc to server: ' + this.state.latitude + ' ' + this.state.longitude);
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    markers: [[position.coords.latitude, position.coords.longitude]]
                })
            }, (error) => {
                this.setState({
                    latitude: aeiLat,
                    longitude: aeiLng,
                    markers: [[aeiLat, aeiLng]]
                    })
            })
        }

    }

    showPrettyInfo(msg) {
        const content = <h1>{msg}</h1>;
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        };
        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: false,
                },
                overlayClose: false,
                fadeIn: true,
                fadeInSpeed: 200
            }
        });
        sleep(1000).then(() => {
            PopupboxManager.close({
                config: {
                    fadeOut: true,
                    fadeOutSpeed: 200
                }
            });
        });
    }

    onLogged = (access_token, refresh_token) => {
        this.setState({access_token: access_token, refresh_token: refresh_token});
        if(access_token === '')
            this.showPrettyInfo('Wylogowano')
        else
            this.showPrettyInfo('Zalogowano')
    };

    render() {
        const {
             isLoading
        } = this.state;

        if (isLoading) {
            // return <p > Loading... < /p >;
        }

        const {latitude, longitude} = this.state;
        const position = [latitude, longitude];

        return(
            <Map center={position} zoom={17} maxZoom={19} onClick={this.newMarkerPosition} id='map'>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <Control position="topright">
                    <Captcha lat={this.state.latitude} lng={this.state.longitude}/>
                </Control>

                <Control position="topright">
                    <button onClick={this.getMyLocation}>
                        Wybierz moją lokalizację
                    </button>
                </Control>

                <Control position="topright">
                    <MarkersView lat={this.state.latitude} lng={this.state.longitude} tkn={this.state.access_token} />
                </Control>

                <Control position="topright">
                    <Login onLogged={this.onLogged}/>
                </Control>

                <Marker position={position} icon={userIcon}>
                    <Popup>
                        <h3>Twoja wybrana lokalizacja</h3>
                    </Popup>
                </Marker>
            </Map>
        )
    }
}

export default App;