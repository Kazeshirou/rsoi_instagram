import React, { Component } from "react";
import InstaService from '../services/instaService';

export default class LikeButton extends Component {
    service = new InstaService();
    state = {
        liked: this.props.post.liked
    };


    render() {
        if (!this.state.liked) {
            return (
                <button className="button_unliked"
                    type="button" onClick={() => {
                        this.service.like(this.props.post.id);
                        this.setState({ liked: true })
                    }}>
                    <span role="img" aria-label="">&#128077;</span>
                </button>
            )
        }
        return (

            <button className="button_liked"
                type="button" onClick={() => {
                    this.service.unlike(this.props.post.id);
                    this.setState({ liked: false })
                }}>
                <span role="img" aria-label="">&#128077;</span>
            </button>
        )
    }
}