import React from 'react';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';

const defaultContext = {
    searchId: '',
    request: null,
    response: null
};

export const SearchResultsContext = React.createContext(defaultContext);

export function SearchResultsProvider(props){

    const { searchId } = props;

    const [response, request] = useRequest({
            url: `${server.siteUrl}/data/search/saved/${searchId}/results?format=json&t=${Date.now()}`,
            method: 'GET'
        }
    );

    // URL for this page
    // http://10.100.100.17/read/#/worklists/xs1566791876575

    // URL for data
    // http://10.100.100.17/data/search/saved/xs1566791876575/results?format=json&t=1568745242774

    return (
        <SearchResultsContext.Provider value={{ searchId, request, response }}>
            {props.children}
        </SearchResultsContext.Provider>
    )

}
