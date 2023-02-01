import React from 'react';

function NotFound(props){
    return (
        <div className="not-found text-center" style={{ width: 600, margin: '0 auto' }}>
            {console.log(props)}
            <h1>Didn't find ur page.</h1>
            <div className="alert alert-dark">
                "{window.location.href}" does not exist
            </div>
        </div>
    );
}

export default NotFound;
