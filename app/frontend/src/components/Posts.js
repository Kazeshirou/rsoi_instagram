import React, { Component } from 'react';
import Post from './Post';
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
        this.service.getAllPosts(this.props.params)
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
            const { name, photo, src, descr, id } = item;
            return <Post key={id} id={id} user={{ name, photo }} src={src} description={descr} />
        });
    }

    render() {
        const { error, posts } = this.state;

        const items = this.renderItems(posts);
        return (
            <div className="left">
                {items}
            </div>
        );
    }
}