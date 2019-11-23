import React from "react";
import './Login.css';
import {PopupboxContainer, PopupboxManager} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.refactorToRegistrationPopup = this.refactorToRegistrationPopup.bind(this);
        this.openLoginPopup = this.openLoginPopup.bind(this);
        this.refactorToLoginPopup = this.refactorToLoginPopup.bind(this);
        this.logged = this.logged.bind(this);
        this.registered = this.registered.bind(this);
    }

    logged() {
        alert("Zalogowano!");

        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        })
    }

    registered() {
        alert("Zarejestrowano!");

        PopupboxManager.close({
            config: {
                fadeOut: true,
                fadeOutSpeed: 500
            }
        })
    }

    openLoginPopup() {
        const content = (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło"/>

                    <button className="big_green_button" type="button" onClick={this.logged}>Zaloguj się</button>
                    <button className="small_blue_button" onClick={this.refactorToRegistrationPopup}
                            type="button">Rejestracja
                    </button>
                </div>
            </form>
        );

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
        const content = (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło"/>

                    <label><b>Powtórz hasło</b></label>
                    <input type="password" placeholder="Powtórz hasło"/>

                    <button className="big_green_button registration_popup_registration_button" type="button"
                            onClick={this.registered}>Zarejestruj się
                    </button>
                    <button className="small_blue_button registration_popup_login_button"
                            onClick={this.refactorToLoginPopup}
                            type="button">Logowanie
                    </button>
                </div>
            </form>
        );

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
        const content = (
            <form>
                <div className="container">
                    <label><b>Nazwa użytkownika</b></label>
                    <input type="text" placeholder="Wprowadź nazwa użytkownika"/>

                    <label><b>Hasło</b></label>
                    <input type="password" placeholder="Wprowadź hasło"/>

                    <button className="big_green_button" type="button" onClick={this.logged}>Zaloguj się</button>
                    <button className="small_blue_button" onClick={this.refactorToRegistrationPopup}
                            type="button">Rejestracja
                    </button>
                </div>
            </form>
        );

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
                <button onClick={this.openLoginPopup}>Zaloguj</button>
                <PopupboxContainer/>
            </div>
        )
    }
}