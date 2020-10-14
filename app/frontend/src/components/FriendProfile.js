import React, { Component } from 'react';
import Posts from './Posts';
import Users from './Users';
import InstaService from '../services/instaService';

export default class Profile extends Component {
    service = new InstaService();
    render() {
        console.log('friend profile')
        return (
            <div className="container profile">
                <Posts user={{ username: this.props.match.params.username }} profile />
                <Users info user={{ username: this.props.match.params.username }} />
            </div>
        );
    }

}