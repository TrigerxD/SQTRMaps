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
            registration_username: '',
            registration_password: '',
            registration_repeated_password: '',
            registration_email: '',
            access_token: '',
            refresh_token: ''
        };

        this.refactorToRegistrationPopup = this.refactorToRegistrationPopup.bind(this);
        this.openLoginPopupOrLogout = this.openLoginPopupOrLogout.bind(this);
        this.refactorToLoginPopup = this.refactorToLoginPopup.bind(this);
        this.clickedLoginButton = this.clickedLoginButton.bind(this);
        this.clickedRegistrationButton = this.clickedRegistrationButton.bind(this);
        this.getLoginForm = this.getLoginForm.bind(this);
        this.getRegistrationForm = this.getRegistrationForm.bind(this);
        this.isLogged = this.isLogged.bind(this);
        this.logout = this.logout.bind(this);
    }

    clickedLoginButton() {
        const username = this.state.login_username.value;
        const password = this.state.login_password.value;

        if (this.state.login_username === '' || username === '') {
            alert("Wprowadź nazwę użytkownmika!");
            return;
        }

        if (this.state.login_password === '' || password === '') {
            alert("Wprowadź hasło!");
            return;
        }

        this.state.login_username.value = '';
        this.state.login_password.value = '';

        function responseService(response) {
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
            login_context.logged(response_json.access, response_json.refresh)
        }

        fetch('http://127.0.0.1:8000/api/token/', {
            method: 'post',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            "body": JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then(responseService)
            .then(json => tokenService(json, this))
            .catch(error => console.log(error));
    }

    logged(access_token, refresh_token) {

        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        });

        this.setState({button_text: 'Wyloguj'});
        this.props.onLogged(access_token, refresh_token);
    }

    registered() {
        this.refactorToLoginPopup();
    }

    clickedRegistrationButton() {
        const username = this.state.registration_username.value;
        const email = this.state.registration_email.value;
        const password = this.state.registration_password.value;
        const repeated_password = this.state.registration_repeated_password.value;

        if (this.state.registration_username === '' || username === '') {
            alert("Wprowadź nazwę użytkownmika!");
            return;
        }

        if (this.state.registration_email === '' || email === "") {
            alert("Wprowadź e-mail!");
            return;
        }

        if (this.state.registration_password === '' || password === '') {
            alert("Wprowadź hasło!");
            return;
        }

        if (this.state.registration_repeated_password === '' || repeated_password === "") {
            alert("Powtórz wpisane hasło!");
            return;
        }

        if (password !== repeated_password) {
            alert("Podane hasła są różne!");
            return;
        }

        this.state.registration_username.value = '';
        this.state.registration_email.value = '';
        this.state.registration_password.value = '';
        this.state.registration_repeated_password.value = '';

        function responseService(response, login_context) {
            if (response.status === 201) {
                login_context.registered();
                alert("Utworzono nowego użytkownika!")
            } else if (response.status === 409) {
                alert('Taki użytkownik już istnieje!');
            } else
                alert('Coś poszło nie tak');
        }

        fetch('http://127.0.0.1:8000/user/', {
            method: 'post',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            "body": JSON.stringify({
                "username": username,
                "password": password,
                "email": email
            })
        })
            .then(response => responseService(response, this))
            .catch(error => console.log(error));
    }

    getLoginForm() {
        return (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"
                           onChange={evt => this.updateLoginUsername(evt)}/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło"
                           onChange={evt => this.updateLoginPassword(evt)}/>

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
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"
                           onChange={evt => this.updateRegistrationUsername(evt)}/>

                    <label><b>E-mail</b></label>
                    <input type="email" placeholder="Wprowadź E-mail"
                           onChange={evt => this.updateRegistrationEmail(evt)}/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło"
                           onChange={evt => this.updateRegistrationPassword(evt)}/>

                    <label><b>Powtórz hasło</b></label>
                    <input type="password" placeholder="Powtórz hasło"
                           onChange={evt => this.updateRegistrationRepeatedPassword(evt)}/>

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

    updateLoginUsername(evt) {
        this.setState({
            login_username: evt.target
        });
    }

    updateLoginPassword(evt) {
        this.setState({
            login_password: evt.target
        });
    }

    updateRegistrationUsername(evt) {
        this.setState({
            registration_username: evt.target
        });
    }

    updateRegistrationPassword(evt) {
        this.setState({
            registration_password: evt.target
        });
    }

    updateRegistrationRepeatedPassword(evt) {
        this.setState({
            registration_repeated_password: evt.target
        });
    }

    updateRegistrationEmail(evt) {
        this.setState({
            registration_email: evt.target
        });
    }

    isLogged() {
        return this.state.access_token !== '';
    }

    logout() {
        this.setState({access_token: '', refresh_token: ''});
        this.props.onLogged('', '');
        this.setState({button_text: 'Zaloguj'});
        //alert('Wylogowano');
    }

    openLoginPopupOrLogout() {
        if (this.isLogged()) {
            this.logout();
            return;
        }

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

        if (this.state.login_username)
            this.state.login_username.value = '';

        if (this.state.login_password)
            this.state.login_password.value = '';

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

        if (this.state.registration_username)
            this.state.registration_username.value = '';

        if (this.state.registration_password)
            this.state.registration_password.value = '';

        if (this.state.registration_repeated_password)
            this.state.registration_repeated_password.value = '';

        if (this.state.registration_email)
            this.state.registration_email.value = '';

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
                <button onClick={a => this.openLoginPopupOrLogout(a)}> {this.state.button_text} </button>
                <PopupboxContainer/>
            </div>
        )
    }
}