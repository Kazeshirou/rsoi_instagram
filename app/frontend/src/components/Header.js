import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PopupButton from './PopupButton';
import logo from '../logo.svg';


export default class Header extends Component {
    renderLogo() {
        return (
            <Link to="/" className="logo">
                <img src={logo} alt="logo"></img>
            </Link>
        );
    }

    renderCreateButton() {
        return (
            <PopupButton
                content={<h3>Создать</h3>}
                popupContent={null}
            />
        );
    }

    renderLink(to, value) {
        return (
            <Link to={to} className="menu__links">
                {value}
            </Link>
        );
    }

    renderNav(auth) {
        return (
            <nav className="links">
                <ul>
                    <li>
                        {this.renderLink("/", 'Лента')}
                    </li>
                    <li>
                        {this.renderLink("/profile", 'Профиль')}
                    </li>
                    {auth && (
                        <li>
                            {this.renderLink("/logout", 'Выход')}
                        </li>
                    )}
                </ul>
            </nav>
        );
    }

    render() {
        const { auth } = this.props;
        return (
            <header>
                <div className="container h-flex">
                    {this.renderLogo()}
                    {auth && this.renderCreateButton()}
                    {this.renderNav(auth)}
                </div>
            </header>
        );
    }
}
