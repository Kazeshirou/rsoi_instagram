import React from 'react';
import RegistationForm from './RegistrationForm';

const RegistrationPage = (props) => {
    return (
        <div className="container">
            <RegistationForm service={props.service} />
        </div>
    );
}

export default RegistrationPage;