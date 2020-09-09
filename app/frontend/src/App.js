import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LoginForm from './components/LoginForm';
import RegistrationPage from './components/RegistrationPage';

export default class App extends Component {
    state = {
        timeout: 30 * 60 * 1000
    };

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
        if (!token) {
            this.refreshToken();
        }
        this.setState({ token: token });
    }

    getToken = () => {
        return this.state.token;
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
                        <Route path="/profile" component={this.protectedPage(Profile)} exact />
                        <Route path="/" component={this.protectedPage(Feed)} exact />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </Router>
        );
    }
}
