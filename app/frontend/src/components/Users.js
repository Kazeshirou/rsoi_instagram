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
        this.service.getFriends(this.state.friends.length, this.props.username)
            .then(this.onFriendsLoaded)
            .catch(err => console.log(err));
        console.log(this.props.username)
        this.service.getUser(this.props.username)
            .then(this.onUserLoaded)
            .catch(err => console.log(err));

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

            return (
                <User
                    key={item.id}
                    user={item}
                    min />
            )
        });
    }

    render() {
        const friends = this.renderItems(this.state.friends);
        return (
            <div className="users">
                {this.props.info ?
                    <User user={this.state.user} info /> :
                    <User user={this.state.user} />
                }
                <ScrollContainer loadContent={this.updateData}>
                    {friends}
                </ScrollContainer>
            </div>
        );
    }
}