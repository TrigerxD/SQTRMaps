import React from "react";
import './Login.css';
import {PopupboxContainer, PopupboxManager} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            button_text: 'Zaloguj',
            login_username: '',
            login_password: '',
            login_repeated_password: '',
            access_token: '',
            refresh_token: ''
        };

        this.refactorToRegistrationPopup = this.refactorToRegistrationPopup.bind(this);
        this.openLoginPopup = this.openLoginPopup.bind(this);
        this.refactorToLoginPopup = this.refactorToLoginPopup.bind(this);
        this.clickedLoginButton = this.clickedLoginButton.bind(this);
        this.clickedRegistrationButton = this.clickedRegistrationButton.bind(this);
        this.getLoginForm = this.getLoginForm.bind(this);
        this.getRegistrationForm = this.getRegistrationForm.bind(this);
    }

    clickedLoginButton() {

        if (this.state.login_username === "") {
            alert("Wprowadź nazwe użytkownmika!");
            return;
        }

        if (this.state.login_password === "") {
            alert("Wprowadź hasło!");
            return;
        }

        function serviceResponse(response) {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                alert('Nieznaleziono takiego użytkownika!');
            } else
                alert('Coś poszło nie tak');
        }

        function tokenService(response_json, login_context) {
            if (!response_json)
                return;

            login_context.setState({access_token: response_json.access, refresh_token: response_json.refresh});
            alert(login_context.state.access_token);
            alert(login_context.state.refresh_token);

            login_context.logged()
        }

        fetch('http://127.0.0.1:8000/api/token/', {
            method: 'post',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            "body": JSON.stringify({
                "username": this.state.login_username.value,
                "password": this.state.login_password.value
            })
        })
            .then(serviceResponse)
            .then(a => tokenService(a, this))
            .catch(error => console.log(error));

        this.state.login_username.value = '';
        this.state.login_password.value = '';

        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        })
    }

    logged() {
        alert('Zalogowano!');
        this.setState({button_text: 'Wyloguj'});
    }

    clickedRegistrationButton() {
        alert("Zarejestrowano!");

        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        })
    }

     getLoginForm() {
        return (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"
                           onChange={evt => this.updateUsername(evt)}/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło" onChange={evt => this.updatePassword(evt)}/>

                    <button className="big_green_button" type="button" onClick={this.clickedLoginButton}>Zaloguj się
                    </button>
                    <button className="small_blue_button" onClick={this.refactorToRegistrationPopup}
                            type="button">Rejestracja
                    </button>
                </div>
            </form>
        );
    }

    getRegistrationForm() {
        return (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika" onChange={evt => this.updateUsername(evt)}/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło" onChange={evt => this.updatePassword(evt)}/>

                    <label><b>Powtórz hasło</b></label>
                    <input type="password" placeholder="Powtórz hasło" onChange={evt => this.updateRepeatedPassword(evt)}/>

                    <button className="big_green_button registration_popup_registration_button" type="button"
                            onClick={this.clickedRegistrationButton}>Zarejestruj się
                    </button>
                    <button className="small_blue_button registration_popup_login_button"
                            onClick={this.refactorToLoginPopup}
                            type="button">Logowanie
                    </button>
                </div>
            </form>
        );
    }

    updateUsername(evt) {
        this.setState({
            login_username: evt.target
        });
    }

    updatePassword(evt) {
        this.setState({
            login_password: evt.target
        });
    }

    updateRepeatedPassword(evt) {
        this.setState({
            login_repeated_password: evt.target
        });
    }

    openLoginPopup() {
        const content = this.getLoginForm();

        PopupboxManager.open({
            content,
            config: {
                titleBar: {
                    enable: true,
                    text: 'Logowanie'
                },
                fadeIn: true,
                fadeInSpeed: 500
            }
        })
    }

    refactorToRegistrationPopup() {
        const content = this.getRegistrationForm();

        PopupboxManager.update({
            content,
            config: {
                titleBar: {
                    text: 'Rejestracja'
                }
            }
        })
    }

    refactorToLoginPopup() {
        const content = this.getLoginForm();

        PopupboxManager.update({
            content,
            config: {
                titleBar: {
                    text: 'Logowanie'
                }
            }
        })
    }

    render() {
        return (
            <div>
                <button onClick={a => this.openLoginPopup(a)}>{this.state.button_text}</button>
                <PopupboxContainer/>
            </div>
        )
    }
}