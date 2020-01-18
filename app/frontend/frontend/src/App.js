import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import axios from "axios";

import TelescopesPage from "./telescopesPage";
import ObjectsPage from "./objectsPage";
import VisibilityPage from "./visibilityPage";
import LoginPage from "./loginPage";

import './App.css';

// class Clock extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { date: new Date() };
//     }

//     componentDidMount() {
//         this.timerID = setInterval(
//             () => this.tick(),
//             1000
//         );
//     }

//     componentWillUnmount() {
//         clearInterval(this.timerID);
//     }

//     tick() {
//         this.setState({
//             date: new Date()
//         });
//     }

//     render() {
//         return (
//             <div className="Clock">
//                 <h1>Сейчас {this.state.date.toLocaleTimeString()}.</h1>
//             </div>
//         );
//     }
// }

const token = axios.create({
    baseURL: `http://localhost:49005/api/v1/oauth2/token`,
    responseType: "json",
    validateStatus: (status) => {
        return status !== 424 && status !== 501;
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: null
        };
    }

    logout = () => {
        this.setState({ token: null});
    }

    login = (user) => {
        this.setState({ user: user});
    }

    token = (token) => {
        this.setState({ token: token });
    }

    refreshToken = () => {
        token.put('/', { client_id: 'telescopes', client_secret: '654321',  refresh: this.state.token.refreshToken, redirect_uri: 'http://localhost:3000/login' })
            .then(res => {
                if (res.status === 200) {
                    this.token(res.data);
                    alert('Try again');
                    return 200;
                }
                else {
                    this.token(null);
                    alert('Need to login');
                    return 401;
                }
            })
    }

    render() {
        return (
            <Router>
                <Container className="p-3">
                    <Jumbotron>
                        <h2>
                            <ButtonToolbar className="custom-btn-toolbar">
                                <LinkContainer to="/">
                                    <Button variant="dark">Home</Button>
                                </LinkContainer>
                                <LinkContainer to="/telescopes">
                                    <Button variant="outline-dark">Telescopes</Button>
                                </LinkContainer>
                                <LinkContainer to="/objects">
                                    <Button variant="outline-dark">Objects</Button>
                                </LinkContainer>
                                <LinkContainer to="/visibility">
                                    <Button variant="outline-dark">Visibility</Button>
                                </LinkContainer>
                                {
                                    this.state.token ? 
                                        (<Button variant="secondary" onClick={this.logout}>Log out</Button>) :
                                        (<LinkContainer to="/login">
                                            <Button variant="outline-primary">Log in</Button>
                                        </LinkContainer>)
                                }
                            </ButtonToolbar>
                        </h2>
                        <Switch>
                            <Route path="/objects">
                                <ObjectsPage />
                            </Route>
                            <Route path="/visibility">
                                {this.state.token ? <VisibilityPage token={() => this.state.token.value}  refreshToken={this.refreshToken}/> : <Redirect push to="/login" />}
                            </Route>
                            <Route path="/telescopes">
                                <TelescopesPage />
                            </Route>
                            <Route path="/login">
                                {this.state.token ? <Redirect to='/' /> : <LoginPage login={this.login} user={() => this.state.user} token={this.token} />}               
                            </Route>
                            <Route path="/">
                                <h1 className="header">
                                    Welcome{this.state.token ? (", " + this.state.token.username) : null }!
                                </h1>
                            </Route>
                        </Switch>
                    </Jumbotron>
                </Container>
            </Router>
        );
    }
}

export default App;
