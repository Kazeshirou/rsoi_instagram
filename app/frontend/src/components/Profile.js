import React from 'react';
import User from './User';
import Palette from './Palette';

const Profile = (props) => {
    return (
        <div className="container profile">
            <User
                src="https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg"
                alt="man"
                name="Scott" />
            <Palette service={props.service} />
        </div>
    );
}

export default Profile;