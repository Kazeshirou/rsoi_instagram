import React, { Component } from "react";
import InstaService from '../services/instaService';

export default class LikeButton extends Component {
    service = new InstaService();
    state = {
        liked: this.props.liked
    };


    render() {
        if (!this.state.liked) {
            return (
                <button className="button_unliked"
                    type="button" onClick={() => {
                        this.service.like(this.props.postId, this.props.userId);
                        this.setState({ liked: true })
                    }}>
                    👍
                </button>
            )
        }
        return (

            <button className="button_liked"
                type="button" onClick={() => {
                    this.service.unlike(this.props.postId, this.props.userId);
                    this.setState({ liked: false })
                }}>
                👍
            </button>
        )
    }
}