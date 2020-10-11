import React, { Component } from 'react';
import User from './User';
import LikeButton from './LikeButton'

export default class Post extends Component {
    render() {
        const post = this.props.post;
        return (
            <div className="post">
                <User
                    user={post}
                    min />
                <img src={post.src} alt={post.src}></img>
                <div className="h-flex ">
                    <div>
                        <div className="post__text">
                            {new Date(post.createdAt).toLocaleString("ru-RU")}
                        </div>
                        <div className="post__text">
                            {post.description}
                        </div>
                    </div>
                    <LikeButton liked={post.liked} />
                </div>
            </div>
        );
    }
}