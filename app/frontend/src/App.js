import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';

export default class App extends Component {
    state = {
        timeout: 30 * 60 * 1000,
        auth: false
    };

    onAction = (e) => {
        this.idleTimer.reset();
        this.setState({ auth: localStorage.getItem('token') ? true : false });
    }

    onIdle = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    getUser = () => {
        return this.state.user;
    }

    protectedPage = (component) => {
        return this.state.auth ? component : LoginForm;
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
                    <Header auth={this.state.auth} />
                    <Switch>
                        {!this.state.auth && <Route path="/registration" component={RegistrationForm} exact />}
                        {this.state.auth && <Route path="/logout" component={() => { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); return null; }} />}
                        <Route path="/profile" component={this.protectedPage(Profile)} exact />
                        <Route path="/" component={this.protectedPage(Feed)} exact />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </Router>
        );
    }
}
