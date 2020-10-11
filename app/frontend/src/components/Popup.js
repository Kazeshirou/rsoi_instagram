
import React, { useRef, useEffect } from "react";

const useOuterClickNotifier = (onOuterClick, innerRef) => {
    useEffect(
        () => {
            // only add listener, if the element exists
            if (innerRef.current) {
                document.addEventListener("click", handleClick);
            }

            // unmount previous first in case inputs have changed
            return () => document.removeEventListener("click", handleClick);

            function handleClick(e) {
                innerRef.current && !innerRef.current.contains(e.target) && onOuterClick(e);
            }
        },
        [onOuterClick, innerRef] // invoke again, if inputs have changed
    );
}

const Popup = (props) => {
    const innerRef = useRef(null);
    useOuterClickNotifier(
        e => props.outsideAction(),
        innerRef
    );
    return (
        <div className='popup' >
            <div ref={innerRef} className='popup_inner'>
                {props.content}
            </div>
        </div >
    );
}

export default Popup;