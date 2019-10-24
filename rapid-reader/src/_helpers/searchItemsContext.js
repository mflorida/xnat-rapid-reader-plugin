import React, { useState, createContext } from 'react';

export const SearchItemsContext = createContext();

export function searchItemsProvider(props){

    const [searchItems, setSearchItems] = useState({});

    return (
        <SearchItemsContext.Provider exptId={props.exptId}>
            {props.children}
        </SearchItemsContext.Provider>
    )

}
