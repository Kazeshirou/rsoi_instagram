import React, { Component } from 'react';
import User from './User';
import ErrorMessage from './Error';
import InstaService from '../services/instaService';

export default class Posts extends Component {
    service = new InstaService();
    state = {
        posts: []
    };

    componentDidMount() {
        this.updatePosts();
    }

    updatePosts() {
        this.service.getAllPosts()
            .then(this.onPostsLoaded)
            .catch(err => console.log(err));
    }

    onPostsLoaded = (posts) => {
        this.setState({
            posts
        });
    }

    renderItems(arr) {
        return arr.map(item => {
            const { username, photo, src, description, id } = item;

            return (
                <div key={id} className="post">
                    <User
                        src={photo}
                        username={username}
                        min />
                    <img src={src} alt={src}></img>
                    <div className="post__name">
                        {username}
                    </div>
                    <div className="post__description">
                        {description}
                    </div>
                </div>
            )
        });
    }

    render() {
        const { error, posts } = this.state;

        if (error) {
            return <ErrorMessage />;
        }

        const items = this.renderItems(posts);
        return (
            <div className="left">
                {items}
            </div>
        );
    }
}