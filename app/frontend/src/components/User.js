import React from 'react';

const User = (props) => {
    const { min, user } = props;

    return (
        <a href={`/profile/${user.username}`} className={min ? "user min" : "user"}>
            <img src={user.profileImg} alt={user.profileImg}></img>
            <div>{user.username}</div>
        </a>
    );
}

export default User;