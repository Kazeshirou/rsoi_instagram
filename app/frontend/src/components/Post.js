import React, { Component } from 'react';
import User from './User';

export default class Post extends Component {
    render() {
        const { id, user, src, descr } = this.props;

        return (
            <div key={id} className="post">
                <User
                    src={user.photo}
                    name={user.name}
                    min />
                <img src={src} alt={src}></img>
                <div className="post__name">
                    {name}
                </div>
                <div className="post__description">
                    {descr}
                </div>
            </div>
        );
    }
}