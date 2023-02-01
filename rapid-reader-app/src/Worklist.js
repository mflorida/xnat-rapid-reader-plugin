import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';

function Worklist(props){

    const { searchId, templateId } = props.match.params;

    // hard-code the 'Bone Age' template for now
    // TODO: how do we get the templateId dynamically? Include in the stored search name?
    // let templateId = '101';

    // const { resultCount } = extractData;

    const [response, request] = useRequest({
            url: `${server.siteUrl}/data/search/saved/${searchId}/results?format=json&t=${Date.now()}`,
            method: 'GET'
        }
    );

    // URL for this page
    // {SITE}/read/#/worklists/xs1566791876575

    // URL for data
    // {SITE}/data/search/saved/xs1566791876575/results?format=json&t=1568745242774

    function resultCount(data){
        console.log('resultCount');
        return (data && data.ResultSet && data.ResultSet.Result) ?
            data.ResultSet.Result.length :
            0;
    }

    return (
        <div className="stored-search">

            {!response || !response.data ? (
                <small>Loading...</small>
            ) : (
                <>
                    {/*<h1>Stored Search <b>{response.data.ResultSet.ID}</b></h1>*/}
                    {!resultCount(response.data) ? (
                        <i>No results.</i>
                    ) : (
                        <>
                            {/* redirect to the first item? */}
                            <Redirect to={`/worklists/${searchId}/${templateId}/1/${resultCount(response.data)}`}/>
                            {/*<ViewSession exptList={response.data.ResultSet.Result}/>*/}
                            {/*<ul>*/}
                            {/*    {response.data.ResultSet.Result.map((item, idx) => (*/}
                            {/*        <li key={`search-item-${item.expt_id}`}>*/}
                            {/*            <Link to={`/searches/${searchId}/${idx}`}>*/}
                            {/*                {item.expt_id}*/}
                            {/*            </Link>*/}
                            {/*            /!*<a href={`${server.siteUrl}/read/#/viewer/proj=${item.xnat_subjectdata_project}/subj=${item.xnat_subjectdata_subjectid}/expt=${item.expt_id}/label=${item.label}`}>{item.label}</a>*!/*/}
                            {/*        </li>*/}
                            {/*    ))}*/}
                            {/*</ul>*/}
                        </>
                    )}
                </>
            )}

        </div>
    );
}

export default Worklist;
