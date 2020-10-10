import React, { Component } from 'react';
import Post from './Post';
import ScrollContainer from './ScrollContainer';
import InstaService from '../services/instaService';

export default class Posts extends Component {
    service = new InstaService();
    state = {
        posts: []
    };

    componentDidMount() {
        this.updatePosts();
    }

    updatePosts = () => {
        console.log('updatePosts')
        this.service.getAllPosts(this.state.posts.length)
            .then(this.onPostsLoaded)
            .catch(err => console.log(err));
    }

    onPostsLoaded = (posts) => {
        if (posts && posts.length) {
            this.setState({
                posts: [].concat(this.state.posts, posts)
            });
        }
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
            <ScrollContainer loadContent={this.updatePosts}>
                {items}
            </ScrollContainer>
        );
    }
}