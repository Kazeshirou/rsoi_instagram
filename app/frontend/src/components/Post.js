import React, { Component } from 'react';
import User from './User';
import LikeButton from './LikeButton'

export default class Post extends Component {
    render() {
        const { id, username, profileImg, src, description, createdAt, liked } = this.props.post;
        return (
            <div className="post">
                <User
                    src={profileImg}
                    name={username}
                    min />
                <img src={src} alt={src}></img>
                <div className="h-flex ">
                    <div>
                        <div className="post__text">
                            {new Date(createdAt).toLocaleString("ru-RU")}
                        </div>
                        <div className="post__text">
                            {description}
                        </div>
                    </div>
                    <LikeButton liked={liked} />
                </div>
            </div>
        );
    }
}