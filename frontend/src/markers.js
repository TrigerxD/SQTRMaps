import React from "react";
import L from 'leaflet'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import {render} from 'react-dom'
import {PopupboxManager} from "react-popupbox";
import './markers.css';

export class MarkersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiMarkers: false,
            baseMarkers: false,
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
        this.eraseMap = this.eraseMap.bind(this);
    }

    componentDidMount() {
        this.setState({
            markers: [],
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
        console.log('get markers from api');
        function responseService(response, obj) {
            if (!response.ok){
                if(response.status == 404)
                    alert('Brak hulajnóg BlinkEye w mieście');
                obj.setState({markersLoading : false})
                return
                }

            if(obj.state.apiMarkers)
                return

            var json = response.json()
            json.then(function(values){
                var objects = []
                for (var i = 0; i < values.length; i++){
                    var a1 = obj.state.latitude
                    var a2 = values[i].lat
                    var b1 = obj.state.longitude
                    var b2 = values[i].lng
                    var odl = Math.acos((Math.sin(a1)*Math.sin(a2)+Math.cos(a1)*Math.cos(a2)*Math.cos(Math.abs(b1-b2))))

                    if(odl * 111.195 <= 1){
                        objects.push([values[i].lat, values[i].lng])
                    }
                }
                if(objects.length > 0){
                    var temp = obj.state.markers
                    for( var i = 0; i < temp.length; i++)
                        objects.push(temp[i])
                    obj.setState({
                        markers: objects,
                        markersLoading : false,
                        apiMarkers:true})
                        }
                else{
                    alert('Brak hulajnóg BlinkEye w pobliżu')
                    obj.setState({
                        markersLoading : false,
                        apiMarkers:false})
                }
            })

        }

        fetch('http://127.0.0.1:8000/blinkee/scooters/'+this.props.lat+'/'+this.props.lng+'/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.tkn
            },
        })
        .then(response => responseService(response, this))
        .catch(error => console.log(error))
    }

    getMarkersFromBase(){
        console.log('get markers from base');
        function responseService(response, obj) {
             if (!response.ok){
             console.log(response.status)
                 if(response.status == 404)
                     alert('Brak hulajnóg w promieniu 1km');
                 obj.setState({markersLoading : false})
                 return
                 }

             if(obj.state.baseMarkers){
                obj.setState({markersLoading : false})
                return
                }

            var json = response.json()
            json.then(function(values){
                var objects = []
                for (var i = 0; i < values.length; i++){
                    var a1 = obj.state.latitude
                    var a2 = values[i].lng
                    var b1 = obj.state.longitude
                    var b2 = values[i].lat
                    var odl = Math.acos((Math.sin(a1)*Math.sin(a2)+Math.cos(a1)*Math.cos(a2)*Math.cos(Math.abs(b1-b2))))

                    if(odl * 111.195 <= 1){
                        objects.push([values[i].lng, values[i].lat])
                    }
                }
                if(objects.length > 0){
                    var temp = obj.state.markers
                    for( var i = 0; i < temp.length; i++)
                        objects.push(temp[i])
                    obj.setState({
                        markers: objects,
                        markersLoading : false,
                        baseMarkers:true})
                        }
                else{
                    alert('Brak hulajnóg oznaczonych przez użytkowników w pobliżu')
                    obj.setState({
                        markersLoading : false,
                        baseMarkers:false})
                }
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
            token: this.props.tkn
        });
        this.getMarkersFromBase();
        //this.getMarkersFromApi();
    }

    viewMarkersFromApi() {
        this.setState({
            markersLoading: true,
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn
        });
        //this.getMarkersFromBase();
        this.getMarkersFromApi();
    }

    eraseMap(){
        this.setState({markers : [], baseMarkers: false, apiMarkers: false})
    }

    render() {
        if(!this.props.tkn){
            this.state.markers = []
            this.state.markersLoading = false;
            return('')
        }

        const content = <h1>Wczytywanie...</h1>;
        console.log(this.state.markersLoading)
        if(this.state.markersLoading){
            PopupboxManager.open({
                content,
                config: {
                    titleBar: {
                        enable: false,
                    },
                    overlayClose:false,
                    fadeIn: true,
                    fadeInSpeed: 500
                }
            })
        }else {
            PopupboxManager.close();
        }

            //return <p > Loading... < /p >;

        return (
            <div>
                <button onClick={this.viewMarkersFromBase}>Wyświetl hulajnogi z bazy</button>
                <button className={"submit_button"} onClick={this.viewMarkersFromApi}>Wyświetl hulajnogi z API</button>
                <button className={"submit_button"} onClick={this.eraseMap}>Wyczyść mapę</button>
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