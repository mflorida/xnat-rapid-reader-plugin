import React from 'react';

/**
 * Generic light-colored spinner
 * @param props
 * @returns {*}
 * @constructor
 */
export default function LoadingRequest(props){
    if (props.req && props.req.status && !/^2/.test(props.req.status)) {
        return (
            <div className="card text-white bg-danger mb-3" style={{ maxWidth: '24rem' }}>
                <div className="card-header">An Error Occured</div>
                <div className="card-body">
                    <h5 className="card-title">Status {props.req.status}</h5>
                    <p className="card-text">
                        {props.req.statusText}
                    </p>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={`spinner-boarder ${props.type ? props.type : 'text-light'}`} role="status">
                <span className="sr-only">{props.text || 'Loading...'}</span>
            </div>
        )
    }
}
