import React from 'react';
import Posts from './Posts';
import Users from './Users';
import InstaService from '../services/instaService';

export default function Profile(props) {
    const service = new InstaService();
    if (props.match.params) {
        return (
            <div className="container profile">
                <Posts user username={props.match.params.username} />
                <Users info username={props.match.params.username} />
            </div>
        );
    }
    return (
        <div className="container profile">
            <Posts user username={service.getUsername()} />
            <Users info />
        </div>
    );
}