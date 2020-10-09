import React, { Component } from 'react';
import InstaService from '../services/instaService';
import User from './User';
import Palette from './Palette';


export default class Profile extends Component {
    service = new InstaService();
    state = {
        user: {}
    };

    componentDidMount() {
        this.updateData();
    }

    updateData() {
        this.service.getUser()
            .then(this.onUserLoaded)
            .catch(err => console.log(err));
    }

    onUserLoaded = async (user) => {
        this.setState({
            user
        });
    }

    render() {
        const { username, profileImg, id } = this.state.user;

        return (
            <div className="container profile" >
                <User
                    src={profileImg}
                    username={username} />
                <Palette userId={id} />
            </div>
        );
    }
}