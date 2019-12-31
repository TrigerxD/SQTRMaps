import React from "react";
import {Marker, Popup} from 'react-leaflet'
import {PopupboxManager} from "react-popupbox";
import './markers.css';

export class MarkersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markersLoading: false,
            isLoading: true,
            latitude: 999,
            longitude: 999,
            token: 'x',
            markers: [],
            data: []
        };
        this.printMarker = this.printMarker.bind(this);
        this.getMarkersFromApi = this.getMarkersFromApi.bind(this);
        this.getMarkersFromBase = this.getMarkersFromBase.bind(this);
        this.viewMarkersFromApi = this.viewMarkersFromApi.bind(this);
        this.viewMarkersFromBase = this.viewMarkersFromBase.bind(this);
    }

    componentDidMount() {
        this.setState({
            markers: [],
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn
        });
    }

    printMarker(lat, lng) {
        const location = [lat, lng]
        return (
            <Marker position={location}>
                <Popup>Lokalizacja hulajnogi</Popup>
            </Marker>
        )
    }

    getMarkersFromApi() {
        console.log('get markers from api');

        function responseService(response, obj) {
            if (!response.ok) {
                if (response.status == 404)
                    alert('Brak hulajnóg BlinkEye w mieście');
                obj.setState({markersLoading: false})
                return
            }

            var json = response.json()
            json.then(function (values) {
                for (var i = 0; i < values.length; i++) {
                    var a1 = obj.state.latitude
                    var a2 = values[i].lat
                    var b1 = obj.state.longitude
                    var b2 = values[i].lng
                    var odl = Math.acos((Math.sin(a1) * Math.sin(a2) + Math.cos(a1) * Math.cos(a2) * Math.cos(Math.abs(b1 - b2))))

                    if (odl * 111.195 <= 1) {
                        var temp = obj.state.markers;
                        temp.push([values[i].lat, values[i].lng])
                        obj.setState({markers: temp})
                    }
                }
                obj.setState({markersLoading: false})
            })

        }

        fetch('http://127.0.0.1:8000/blinkee/scooters/' + this.props.lat + '/' + this.props.lng + '/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.tkn
            },
        })
            .then(response => responseService(response, this))
            .catch(error => console.log(error))
    }

    getMarkersFromBase() {
        console.log('get markers from base');

        function responseService(response, obj) {
            if (!response.ok) {
                console.log(response.status)
                if (response.status == 404)
                    alert('Brak hulajnóg w promieniu 1km');
                obj.setState({markersLoading: false})
                return
            }
            var json = response.json()
            json.then(function (values) {
                for (var i = 0; i < values.length; i++) {
                    var a1 = obj.state.latitude
                    var a2 = values[i].lng
                    var b1 = obj.state.longitude
                    var b2 = values[i].lat
                    var odl = Math.acos((Math.sin(a1) * Math.sin(a2) + Math.cos(a1) * Math.cos(a2) * Math.cos(Math.abs(b1 - b2))))

                    if (odl * 111.195 <= 1) {
                        var temp = obj.state.markers;
                        temp.push([values[i].lng, values[i].lat])
                        obj.setState({markers: temp})
                    }
                }
                obj.setState({markersLoading: false})
            })
        }

        fetch('http://127.0.0.1:8000/allmarkers/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.tkn
            },
        })
            .then(response => responseService(response, this))
            .catch(error => console.log(error));
    }

    viewMarkersFromBase() {
        this.setState({
            markersLoading: true,
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn,
            markers: []
        });
        this.getMarkersFromBase();
        //this.getMarkersFromApi();
    }

    viewMarkersFromApi() {
        this.setState({
            markersLoading: true,
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn,
            markers: []
        });
        //this.getMarkersFromBase();
        this.getMarkersFromApi();
    }

    render() {
        if (!this.props.tkn) {
            this.state.markers = []
            this.state.markersLoading = false;
            return ('')
        }

        const content = <h1>Wczytywanie...</h1>;
        console.log(this.state.markersLoading)
        if (this.state.markersLoading) {
            PopupboxManager.open({
                content,
                config: {
                    titleBar: {
                        enable: false,
                    },
                    overlayClose: false,
                    fadeIn: true,
                    fadeInSpeed: 500
                }
            })
        } else {
            PopupboxManager.close();
        }

        //return <p > Loading... < /p >;

        return (
            <div className="container2">

                <button onClick={this.viewMarkersFromBase}>Wyświetl hulajnogi z bazy</button>
                {this.state.markers.map((position, idx) =>
                    <Marker key={idx} position={position}>
                        <Popup>
                            {position[0]}, {position[1]}
                        </Popup>
                    </Marker>
                )}

                <button className={"submit_button"} onClick={this.viewMarkersFromApi}>Wyświetl hulajnogi z API
                </button>
                {this.state.markers.map((position, idx) =>
                    <Marker key={idx} position={position}>
                        <Popup>
                            {position[0]}, {position[1]}
                        </Popup>
                    </Marker>
                )}

            </div>
        )
    }
}

export default MarkersView;