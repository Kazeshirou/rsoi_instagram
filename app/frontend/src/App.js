import React from 'react';
import Header from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Route path="/login" component={LoginPage} exact />
                <Route path="/registration" component={RegistrationPage} exact />
                <Route path="/" component={Feed} exact />
                <Route path="/profile" component={Profile} exact />
            </div>
        </Router>
    );
}

export default App;
