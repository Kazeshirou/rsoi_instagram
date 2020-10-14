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
        const user = this.props.user;
        if (user) {
            return this.service.getUserPosts(this.state.posts.length, user.username)
                .then(this.onPostsLoaded)
                .catch(err => console.log(err));
        }
        return this.service.getAllPosts(this.state.posts.length,)
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

    renderItems = (arr) => {
        return arr.map(item => {
            return <Post key={item.id} post={item} />
        });
    }

    render() {
        const { posts } = this.state;
        const items = this.renderItems(posts);
        return (
            <ScrollContainer loadContent={this.updatePosts}>
                {items}
            </ScrollContainer>
        );
    }
}