import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LoginForm from './components/LoginForm';
import RegistrationPage from './components/RegistrationPage';

import InstaService from './services/instaService'

export default class App extends Component {
    state = {
        timeout: 30 * 60 * 1000
    };

    service = new InstaService((token) => this.refreshToken(token));

    getService = () => {
        return this.service;
    }

    onAction = (e) => {
        this.idleTimer.reset();
    }

    onIdle = (e) => {
        this.setState({ token: undefined });
    }

    refreshToken = (token) => {
        console.log('refreshToken');
        this.setToken(token)
    }

    setToken = (token) => {
        this.setState({ token: token });
    }

    getUser = () => {
        return this.state.user;
    }

    protectedPage = (component) => {
        return this.state.token ? component : this.loginForm;
    }

    loginForm = () => {
        return <LoginForm setToken={this.setToken} />;
    }

    feed = () => {
        return <Feed service={this.getService} />
    }

    profile = () => {
        return <Profile service={this.getService} />
    }

    registrationPage = () => {
        return <RegistrationPage service={this.getService} />
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onIdle={this.onIdle}
                        onAction={this.onAction}
                        debounce={250}
                        timeout={this.state.timeout} />
                    <Header />
                    <Switch>
                        {!this.state.token && <Route path="/registration" component={this.registrationPage} exact />}
                        <Route path="/profile" component={this.protectedPage(this.profile)} exact />
                        <Route path="/" component={this.protectedPage(this.feed)} exact />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </Router>
        );
    }
}
