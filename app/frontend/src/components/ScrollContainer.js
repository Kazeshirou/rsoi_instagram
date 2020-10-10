import React, { Component } from 'react';

export default class ScrollContainer extends Component {
    onScrollList = (event) => {
        const scrollBottom = event.target.scrollTop +
            event.target.offsetHeight === event.target.scrollHeight;

        if (scrollBottom) {
            this.props.loadContent(event);
        }
    }

    render() {
        return (
            <scroll-container onScroll={(event) => this.onScrollList(event)}>
                {this.props.children}
            </scroll-container>
        );
    }
}