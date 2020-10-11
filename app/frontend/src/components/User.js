import React from 'react';

const User = (props) => {
    const { min, user, info } = props;

    return (
        <div className="user__info">
            <a href={`/profile/${user.username}`} className={min ? "user min" : "user"}>
                <img src={user.profileImg} alt={user.profileImg}></img>
                <div>{user.username}</div>
            </a>
            {info &&
                <scroll-container>
                    <h4>Возраст:</h4>
                    <p>{user.age}</p>
                    <h4>Био:</h4>
                    <p>{user.bio}</p>
                </scroll-container>
            }
        </div>
    );
}

export default User;