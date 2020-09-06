import React, { Component } from 'react';
import User from './User';

export default class Users extends Component {
    render() {
        return (
            <div className="right">
                <User
                    src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                    alt="man"
                    name="Scott" />
                
                <div className="users__block">
                    <User
                        src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                        alt="man"
                        name="Scott"
                        min />
                    <User
                        src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                        alt="man"
                        name="Scott"
                        min />
                    <User
                        src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                        alt="man"
                        name="Scott"
                        min />
                    <User
                        src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                        alt="man"
                        name="Scott"
                        min />
                </div>
            </div>
        );
    }
}