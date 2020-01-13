import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import TelescopesPage from "./telescopesPage";
import ObjectsPage from "./objectsPage";
import VisibilityPage from "./visibilityPage";

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

const App = () => (
    <Router>
        <Container className="p-3">
            <Jumbotron>
                <h2>
                    {' '}
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
                    </ButtonToolbar>
                </h2>
                <h1 className="header">
                    {' '}
                    <Switch>
                        <Route path="/objects">
                            {null}
                        </Route>
                        <Route path="/visibility">
                            {null}
                        </Route>
                        <Route path="/telescopes">
                            {null}
                        </Route>
                        <Route path="/">
                            Welcome
                        </Route>
                    </Switch>
                </h1>
                <Switch>
                    <Route path="/objects">
                        <ObjectsPage />
                    </Route>
                    <Route path="/visibility">
                        <VisibilityPage />
                    </Route>
                    <Route path="/telescopes">
                        <TelescopesPage />
                    </Route>
                    <Route path="/">
                        {null}
                    </Route>
                </Switch>
            </Jumbotron>
        </Container>
    </Router>
);

export default App;
