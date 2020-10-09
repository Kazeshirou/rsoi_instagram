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
        this.updateData();
    }

    updateData() {
        this.service.getFriends()
            .then(this.onFriendsLoaded)
            .catch(err => console.log(err));
        this.service.getUser()
            .then(this.onUserLoaded)
            .catch(err => console.log(err));
    }

    onFriendsLoaded = async (friends) => {
        this.setState({
            friends
        });
    }

    onUserLoaded = async (user) => {
        this.setState({
            user
        });
    }

    renderItems(arr) {
        return arr.map(item => {
            const { username, profileImg, id } = item;

            return (
                <User
                    key={id}
                    src={profileImg}
                    username={username}
                    min />
            )
        });
    }

    render() {
        const friends = this.renderItems(this.state.friends);
        const { username, profileImg } = this.state.user;
        return (
            <div className="right">
                <User
                    src={profileImg}
                    username={username} />
                <div className="users__block">
                    {friends}
                </div>
            </div>
        );
    }
}