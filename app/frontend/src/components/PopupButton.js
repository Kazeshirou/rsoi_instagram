import React, { Component } from "react";
import Popup from './Popup';
import InstaService from '../services/instaService';

export default class PopupButton extends Component {
    service = new InstaService();
    state = {
        showPopup: false
    };

    togglePopup = () => {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        const { text, content } = this.props;
        return (
            <>
                {
                    this.state.showPopup &&
                    <Popup
                        content={content}
                        outsideAction={this.togglePopup}

                    />
                }
                <button
                    type="button" onClick={this.togglePopup}>
                    {text}
                </button>
            </>
        )
    }
}