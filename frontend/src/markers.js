import React from "react";

export class MarkersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: this.props.lat,
            longitude: this.props.lng,
            token: this.props.tkn
        };
        this.printMarker = this.printMarker.bind(this);
        this.getMarkersFromApi = this.getMarkersFromApi.bind(this);
        this.getMarkersFromBase = this.getMarkersFromBase.bind(this);
        this.viewMarkers = this.viewMarkers.bind(this);
    }

    componentDidMount() {

    }

    printMarker(){
    }

    getMarkersFromApi(){
    }

    getMarkersFromBase(){
        console.log('get markers: ' + this.state.latitude + ' ' + this.state.longitude + ' ' + this.state.token);
        function responseService(response) {
            console.log(response);
            if (!response.ok)
                alert('Coś poszło nie tak');
        }

        fetch('http://127.0.0.1:8000/allmarkers/', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.token
            },
        })
        .then(responseService)
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
    }

    render() {
        return (
            <div>
                <button onClick={this.viewMarkers}>Wyświetl hulajnogi</button>
            </div>
        )
    }
}

export default MarkersView;