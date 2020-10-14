import React, { Component } from 'react';
import Posts from './Posts';
import Users from './Users';
import InstaService from '../services/instaService';

export default class Profile extends Component {
    service = new InstaService();
    render() {
        if (this.props.match.params.username) {
            console.log('friend profile')
            return (
                <div className="container profile">
                    <Posts user username={this.props.match.params.username} />
                    <Users info username={this.props.match.params.username} />
                </div>
            );
        }
        console.log('user profile', this.service.getUsername());
        return (
            <div className="container profile" >
                <Posts user username={this.service.getUsername()} />
                <Users info username={this.service.getUsername()} />
            </div>
        );
    }
}