import React from 'react';

const User = (props) => {
    const { min, src, username } = props;

    return (
        <a href={`/profile/${username}`} className={min ? "user min" : "user"}>
            <img src={src} alt={src}></img>
            <div>{username}</div>
        </a>
    );
}

export default User;