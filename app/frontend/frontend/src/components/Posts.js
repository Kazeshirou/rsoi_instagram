import React, { Component } from 'react';
import Post from './Post';

export default class Posts extends Component {
    render() {
        return (
            <div className="left">
                <Post src="https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png" alt="inst" />
                <Post src="https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg" alt="second" />
            </div>
        );
    }
}