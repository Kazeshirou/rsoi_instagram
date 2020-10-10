import React, { Component } from 'react';
import ScrollContainer from './ScrollContainer';
import User from './User';
import InstaService from '../services/instaService';

export default class Users extends Component {
    service = new InstaService();
    state = {
        friends: [],
        user: {}
    };

    componentDidMount() {
        this.updateData();
    }

    updateData = () => {
        this.service.getFriends(this.state.friends.length)
            .then(this.onFriendsLoaded)
            .catch(err => console.log(err));
        if (!this.state.user) {
            this.service.getUser()
                .then(this.onUserLoaded)
                .catch(err => console.log(err));
        }
    }

    onFriendsLoaded = async (friends) => {
        if (friends && friends.length) {
            this.setState({
                friends: [].concat(this.state.friends, friends)
            });
        }
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
            <div className="users">
                <User
                    src={profileImg}
                    username={username} />
                <ScrollContainer loadContent={this.updateData}>
                    {friends}
                </ScrollContainer>
            </div>
        );
    }
}