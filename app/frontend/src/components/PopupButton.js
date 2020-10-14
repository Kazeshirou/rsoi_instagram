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
        const { text, content, popupContent } = this.props;
        return (
            <>
                {
                    this.state.showPopup &&
                    <Popup
                        content={popupContent}
                        outsideAction={this.togglePopup}

                    />
                }
                <div onClick={this.togglePopup} className="popup_button">
                    {content}
                </div>
            </>
        )
    }
}