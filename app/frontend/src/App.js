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

    service = new InstaService(this.refreshToken);

    getService = () => {
        return this.service;
    }

    onAction = (e) => {
        this.idleTimer.reset();
    }

    onIdle = (e) => {
        this.setState({ token: undefined });
    }

    refreshToken = () => {
        // some action to refresh token.
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
                        <Route path="/registration" component={RegistrationPage} exact />
                        <Route path="/profile" component={this.protectedPage(this.profile)} exact />
                        <Route path="/" component={this.protectedPage(this.feed)} exact />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </Router>
        );
    }
}
