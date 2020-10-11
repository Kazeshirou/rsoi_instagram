import React from 'react';
import Posts from './Posts';
import Users from './Users';

export default function Profile() {
    return (
        <div className="container profile">
            <Posts user />
            <Users info />
        </div>
    );
}