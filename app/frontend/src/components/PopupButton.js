import React, { Component } from "react";
import InstaService from '../services/instaService';

export default class PopupButton extends Component {
    service = new InstaService();

    render() {
        const { onClick, text } = this.props;
        return (
            <button
                type="button" onClick={onClick}>
                {text}
            </button>
        )
    }
}