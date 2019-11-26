import React from "react";
import './Login.css';
import {PopupboxManager} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
import {ReCaptcha} from 'react-recaptcha-google'

export class Captcha extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVerified: false,
            latitude: 0,
            longitude: 0,
            token: ''
        };
        this.verifyCallback = this.verifyCallback.bind(this);
        this.openPopupbox = this.openPopupbox.bind(this);
        this.getCaptcha = this.getCaptcha.bind(this);
        this.onloadCallback = this.onloadCallback.bind(this);
        this.sendMarker = this.sendMarker.bind(this);
    }

    componentDidMount() {
        if (this.captchaObject) {
            this.captchaObject.reset();
            this.setState({isVerified: false});
        }
    }

    onloadCallback() {
        if (this.captchaObject) {
            this.captchaObject.reset();
            this.setState({isVerified: false});
        }
    }

    verifyCallback(recaptchaToken) {
        if (recaptchaToken) {
            this.setState({isVerified: true});
            this.sendMarker();
        }
    }

    closePopup() {
        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        });
    }

    sendMarker() {
        console.log('Sending loc to server: ' + this.state.latitude + ' ' + this.state.longitude);

        function responseService(response) {
            if (!response.ok)
                alert('Coś poszło nie tak');
        }

        fetch('http://127.0.0.1:8000/addmarker/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.state.token
            },
            "body": JSON.stringify({
                "lat": this.state.longitude,
                "lng": this.state.latitude
            })
        })
            .then(responseService)
            .then(() => this.closePopup())
            .catch(error => console.log(error));
    }

    getCaptcha() {
        return (
            <div>
                <ReCaptcha
                    ref={(el) => {
                        this.captchaObject = el;
                    }}
                    sitekey="6LdcksQUAAAAAP_bwRqB42SZXvUSTtYz4i9OqfZR"
                    render="explicit"
                    onloadCallback={this.onloadCallback}
                    verifyCallback={this.verifyCallback}
                />
            </div>
        );
    }

    openPopupbox() {
        this.setState({
            latitude: this.props.lat,
            isVerified: false,
            longitude: this.props.lng,
            token: this.props.token
        });
        const content = this.getCaptcha();
        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: true,
                    text: 'Potwierdź, że jesteś człowiekiem'
                },
                fadeIn: true,
                fadeInSpeed: 500
            }
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.openPopupbox}>Wyślij lokalizację</button>
            </div>
        )
    }
}

export default Captcha;