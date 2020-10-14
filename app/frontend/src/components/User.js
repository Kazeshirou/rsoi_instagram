import React, { Component } from 'react';
import PopupButton from './PopupButton';
import EditProfileForm from './EditProfileForm'
import InstaService from '../services/instaService';

export default class User extends Component {
    service = new InstaService();

    render() {
        const { min, user, info } = this.props;
        if (!user) {
            return (
                <div className="user__info">
                    <scroll-container>
                        <p>Не удалось загрузить данные пользователя</p>
                    </scroll-container>
                </div>
            )
        }
        const editable = user.username === this.service.getUsername();
        return (
            <div className="user__info">
                <a href={`/profile/${user.username}`} className={min ? "user min" : "user"}>
                    <img src={user.profileImg} alt={user.profileImg}></img>
                    <div>{user.username}</div>
                </a>
                {info &&
                    <scroll-container>
                        {editable && <PopupButton content={<h3>Изменить</h3>} popupContent={<EditProfileForm user={user} />} />}
                        {!editable && <PopupButton content={<h3>Дружить</h3>} popupContent={null} />}
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