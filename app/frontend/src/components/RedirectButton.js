import React from "react";
import { useHistory } from "react-router-dom";

const RedirectButton = (props) => {
    const { to, text } = props;
    const history = useHistory();

    return (
        <button
            type="button" onClick={() => history.push(to)}>
            {text}
        </button>
    )
} 

export default RedirectButton;