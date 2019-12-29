import React from "react";
import L from 'leaflet'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import {render} from 'react-dom'

export class MarkersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 999,
            longitude: 999,
            token: 'x',
            markers: [],
            data: []
        };
        this.printMarker = this.printMarker.bind(this);
        this.getMarkersFromApi = this.getMarkersFromApi.bind(this);
        this.getMarkersFromBase = this.getMarkersFromBase.bind(this);
        this.viewMarkers = this.viewMarkers.bind(this);
    }

    componentDidMount() {
        this.setState({
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn
        });
    }

    printMarker(lat,lng){
    const location = [lat, lng]
    return(
        <Marker position={location}>
            <Popup>Lokalizacja hulajnogi</Popup>
        </Marker>
    )}

    getMarkersFromApi(){
        console.log('get markers from api: ' + this.state.latitude + ' ' + this.state.longitude + ' ' + this.state.token);
        function responseService(response, obj) {
            if (!response.ok)
                alert('Coś poszło nie tak');

            var json = response.json()
            json.then(function(values){
                for (var i = 0; i < values.length; i++){
                    var temp = obj.state.markers;
                    temp.push([values[i].lng, values[i].lat])
                    obj.setState({markers : temp})
                }
            })
        }

        fetch('http://127.0.0.1:8000/blinkee/scooters/'+this.state.latitude+'/'+this.state.longitude+'/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        })
        .then(response => responseService(response, this))
        .catch(error => console.log(error));
    }

    getMarkersFromBase(){
        console.log('get markers from base: ' + this.state.latitude + ' ' + this.state.longitude + ' ' + this.state.token);
        function responseService(response, obj) {
            if (!response.ok)
                alert('Coś poszło nie tak');
            var json = response.json()
            json.then(function(values){
                for (var i = 0; i < values.length; i++){
                    var temp = obj.state.markers;
                    temp.push([values[i].lng, values[i].lat])
                    obj.setState({markers : temp})
                }
            })
        }

        fetch('http://127.0.0.1:8000/allmarkers/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
        })
        .then(response => responseService(response, this))
        .catch(error => console.log(error));
    }

    viewMarkers() {
        this.setState({
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn
        });
        console.log(this.state.latitude);
        console.log(this.state.longitude);
        this.getMarkersFromBase();
        //this.getMarkersFromApi();
        console.log(this.state.markers)
    }

    render() {
        return (
            <div>
                <button onClick={this.viewMarkers}>Wyświetl hulajnogi</button>
                {this.state.markers.map((position, idx) =>
                   <Marker key={'marker-${idx}'} position={position}>
                       <Popup>
                           hulajnoga
                       </Popup>
                   </Marker>
                )}
            </div>
        )
    }
}

export default MarkersView;