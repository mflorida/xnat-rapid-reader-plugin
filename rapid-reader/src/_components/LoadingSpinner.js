import React from 'react';

/**
 * Generic light-colored spinner
 * @param props
 * @returns {*}
 * @constructor
 */
export default function LoadingSpinner(props){
    return (
        <div className={`spinner-boarder ${props.type ? props.type : 'text-light'}`} role="status">
            <span className="sr-only">{props.text || 'Loading...'}</span>
        </div>
    )
}
