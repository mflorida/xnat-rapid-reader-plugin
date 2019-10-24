import React from 'react';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';
import LoadingSpinner from './_components/LoadingSpinner';

function Worklists(props){

    console.log(props);

    const [response, request] = useRequest({
        url: `${server.siteUrl}/data/search/saved?format=json&t=${Date.now()}`,
        method: 'GET'
    });

    function isWorkList(item){
        return /^(read|worklist)/i.test(item.brief_description) && /SessionData$/i.test(item.root_element_name);
    }

    function renderWorklist(data){
        return (data.ResultSet && data.ResultSet.Result) ? data.ResultSet.Result.map(function(item){

                // only return searches that start with 'read' that contain 'SessionData' search results
                if (isWorkList(item)) {

                    const descParts = item.brief_description.split(/[:|]/);

                    let searchId    = item.id;
                    let templateId  = (descParts[2] || '').trim();
                    let description = (descParts[1] || '').trim();


                    return (
                        <>
                            {/*<button key={`search-item-${item.id}`}>*/}
                            <a className="list-group-item list-group-item-action text-white bg-dark" href={`#/worklists/${searchId}/${templateId}`}>{description}</a>
                            {/*</button>*/}
                        </>
                    );

                }
            }
        ) : '';
    }

    return (
        <div className="stored-searches" style={{ width: 600, margin: '20px auto' }}>

            <h1>Worklists</h1>
            {!response || !response.data ? (

                <LoadingSpinner/>

            ) : (
                <div className="list-group">
                    {renderWorklist(response.data)}
                    {console.log(request)}
                </div>
            )}

        </div>
    );
}

export default Worklists;
