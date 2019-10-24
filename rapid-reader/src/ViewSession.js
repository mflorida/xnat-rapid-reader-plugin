import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';
import RadReadFormWrapper from './_components/RadReadFormWrapper';
import LoadingSpinner from './_components/LoadingSpinner';
import ViewerIframe from './_components/ViewerIframe';

function ViewSession(props){

    let { searchId, searchItemIndex, searchItemsLength } = props.match.params;

    const templateId = props.match.params.templateId;

    searchItemIndex = (+searchItemIndex);

    const [searchResponse, searchRequest] = useRequest({
        url: `${server.siteUrl}/data/search/saved/${searchId}/results?format=json&t=${Date.now()}`,
        method: 'GET'
    });

    let results  = null;
    let itemData = null;

    function extractResults(data){
        console.log('extractResults');
        return (results = data.ResultSet.Result);
    }

    function extractItem(data){
        console.log('extractItem');
        return (itemData = extractResults(data)[searchItemIndex - 1]);
    }

    function storeData(){
        searchRequest.then((resp) => {
            // extractItem(resp.data);
            localStorage.setItem(`worklist_${searchId}`, JSON.stringify(itemData));
            // searchItemsLength = searchResponse.data.ResultSet.Result.length;
            console.log(resp);
        });
    }

    function resultCount(data){
        console.log('resultCount');
        return extractResults(data).length;
    }

    function SessionNavButton(props){

        const { txt, newIndex } = props;

        let text = txt;
        let disabled;

        const btnStyle = {
            width: '40%',
            lineHeight: 2
        };

        if (txt === 'Prev') {
            disabled = newIndex <= 0;
            text     = (<>&laquo; Prev</>)
        }
        else {
            disabled = newIndex > searchItemsLength;
            text     = (<>Next &raquo;</>)
        }

        return disabled ? (
            <button disabled style={btnStyle}>{text}</button>
        ) : (
            <Link to={`/worklists/${searchId}/${templateId}/${newIndex}/${searchItemsLength}`}>
                <button style={btnStyle}>{text}</button>
            </Link>
        )
    }

    function ViewHeader(props){

        const { data, itemIndex } = props;

        // this updates the `itemData` variable
        const itemData = extractItem(data);
        console.log(itemData);

        return (

            <header className="header clearfix" style={{ margin: 20, lineHeight: 2.2, verticalAlign: 'middle' }}>

                <div className="float-left" style={{ width: '70%' }}>

                    <Link to="/worklists">
                        <b><>&laquo;&nbsp;</>Worklists</b>
                    </Link><>&nbsp;&nbsp;|&nbsp;&nbsp;</>

                    Session Label: <b>{itemData.label}</b><>&nbsp;&nbsp;|&nbsp;&nbsp;</>
                    Session ID: <b>{itemData.session_id}</b><>&nbsp;&nbsp;|&nbsp;&nbsp;</>
                    Subject: <b>{itemData.xnat_subjectdata_subjectid}</b><>&nbsp;&nbsp;|&nbsp;&nbsp;</>
                    Project: <b>{itemData.project}</b>

                </div>
                <div className="float-right text-right" style={{ width: '30%' }}>
                    <SessionNavButton txt="Prev" newIndex={itemIndex - 1}/>
                    &nbsp;
                    <SessionNavButton txt="Next" newIndex={itemIndex + 1}/>
                </div>
            </header>
        )
    }

    return (
        <div className="view-session" style={{ margin: 20 }}>
            {!searchResponse || !searchResponse.data ? (

                <LoadingSpinner/>

            ) : (
                <>
                    {!resultCount(searchResponse.data) ? (
                        <i>No results.</i>
                    ) : (
                        <>
                            {searchItemIndex > resultCount(searchResponse.data) || searchItemIndex <= 0 ? (
                                <i>Invalid Session</i>
                            ) : (
                                <>
                                    {storeData()}

                                    <ViewHeader data={searchResponse.data} itemIndex={searchItemIndex}/>

                                    <div className="clearfix">

                                        <ViewerIframe dataFields={extractItem(searchResponse.data)}/>

                                        <div id="session-data" style={{ width: '30%', float: 'right' }}>
                                            <div className="pad pad20" style={{ padding: 20 }}>
                                                <div>
                                                    <small>Viewing session #{searchItemIndex} of {searchItemsLength}</small>
                                                </div>
                                                <br/>

                                                <RadReadFormWrapper template={templateId}/>

                                                <table>
                                                    <tbody>
                                                    {(itemData = extractItem(searchResponse.data)) && Object.keys(itemData).sort().map((key, i) => {
                                                        const val = itemData[key];
                                                        return (
                                                            <tr className={(i % 2) ? 'even' : 'odd'}>
                                                                <th>{key}</th>
                                                                <td>{val}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                                {/*<pre>{JSON.stringify(searchResponse.data.ResultSet.Result[searchItemIndex - 1], null, 2)}</pre>*/}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

        </div>
    );
}

export default ViewSession;
