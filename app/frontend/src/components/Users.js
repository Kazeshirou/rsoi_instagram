import React, { Component } from 'react';
import InstaService from '../services/instaService';
import User from './User';

export default class Users extends Component {
    service = new InstaService();
    state = {
        friends: [],
        user: {}
    };

    componentDidMount() {
        this.updateUsers();
    }

    updateUsers() {
        this.service.getUsers()
            .then(this.onUsersLoaded)
            .catch(err => console.log(err));
    }

    onUsersLoaded = ({ user, friends }) => {
        this.setState({
            user,
            friends
        });
    }

    renderItems(arr) {
        return arr.map(item => {
            const { username, profileImg, id } = item;

            return (
                <User
                    key={id}
                    src={profileImg}
                    alt={profileImg}
                    name={username}
                    min />
            )
        });
    }

    render() {
        const friends = this.renderItems(this.state.friends);
        const { username, profileImg, id } = this.state.user;
        return (
            <div className="right">
                <User
                    key={id}
                    src={profileImg}
                    alt={profileImg}
                    name={username} />
                <div className="users__block">
                    {friends}
                </div>
            </div>
        );
    }
}