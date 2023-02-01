import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Get data and use the response in a React hook
 * @param {Object} opts - axios config object string for GET request
 * @param {*} [toWatch] - optional variable to watch to trigger a new request
 * @returns {*[]}
 */
export function useRequest(opts, toWatch){

    console.log('useRequest');

    const [response, setResponse] = useState(null);
    const [request, setRequest] = useState(null);

    const doRequest = function(){

        if (opts.url) {

            const req = axios(opts);

            setRequest(req);

            req.then((resp) => {
                setResponse(resp);
                console.log('useRequest:response');
                console.log(resp);
                return resp;
            });

        }

    };

    useEffect(() => {
        doRequest();
    }, toWatch ? [].concat(toWatch) : []);

    return [response, request];

}
