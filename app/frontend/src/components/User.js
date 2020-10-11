import React, { Component } from 'react';
import Popup from './Popup';
import PopupButton from './PopupButton';
import EditProfileForm from './EditProfileForm'
import InstaService from '../services/instaService';

export default class User extends Component {
    service = new InstaService();
    state = {
        showUpdatePopup: false
    }

    toggleUpdatePopup = () => {
        this.setState({
            showUpdatePopup: !this.state.showUpdatePopup
        });
    }

    render() {
        const { min, user, info } = this.props;
        const editable = user.username === this.service.getUsername();
        return (
            <div className="user__info">
                {
                    this.state.showUpdatePopup &&
                    <Popup
                        content={<EditProfileForm user={user} />}
                        outsideAction={this.toggleUpdatePopup}

                    />
                }
                <a href={`/profile/${user.username}`} className={min ? "user min" : "user"}>
                    <img src={user.profileImg} alt={user.profileImg}></img>
                    <div>{user.username}</div>
                </a>
                {info &&
                    <scroll-container>
                        {editable && <PopupButton text={'Изменить'} onClick={() => this.toggleUpdatePopup()} />}
                        <h4>Возраст:</h4>
                        <p>{user.age}</p>
                        <h4>Био:</h4>
                        <p>{user.bio}</p>
                    </scroll-container>
                }
            </div>
        );
    }
};