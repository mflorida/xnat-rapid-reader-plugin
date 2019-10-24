import React from 'react';
import { Link } from 'react-router-dom';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';
import RadReadFormWrapper from './_components/RadReadFormWrapper';
import LoadingSpinner from './_components/LoadingSpinner';
import ViewerIframe from './_components/ViewerIframe';

import './ViewSession.css';

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

        let text     = txt;
        let disabled = false;
        let linkTo   = `/worklists/${searchId}/${templateId}/${newIndex}/${searchItemsLength}`;

        const btnStyle = {
            width: '45%',
            lineHeight: 1.6
        };

        if (txt === 'prev') {
            disabled       = newIndex <= 0;
            text           = (<>&laquo; Back</>);
            btnStyle.float = 'left';
        }
        else {
            // disabled       = newIndex > searchItemsLength;
            text           = (<>Save &raquo;</>);
            btnStyle.float = 'right';
            if (newIndex > searchItemsLength) {
                linkTo = '/worklists';
                text   = 'Done';
            }
        }

        return disabled ? (
            <button disabled style={btnStyle}>{text}</button>
        ) : (
            <Link style={btnStyle} to={linkTo}>
                <button style={{ width: '100%' }}>{text}</button>
            </Link>
        );
    }

    function ViewHeader(props){

        const { data, itemIndex } = props;

        // this updates the `itemData` variable
        const itemData = extractItem(data);
        console.log(itemData);

        return (

            <header style={{ margin: '0 20px', lineHeight: 1.6, verticalAlign: 'middle' }}>

                <section className="clearfix">
                    <div className="float-left">
                        <Link to="/worklists">
                            <b><>&laquo;&nbsp;</>
                                Worklists</b>
                        </Link>
                    </div>
                    <div className="float-right">
                        <small>Viewing session #{searchItemIndex} of {searchItemsLength}</small>
                    </div>
                    <div className="clearfix"/>
                </section>

                <section style={{ margin: '20px 0' }}>
                    <table id="session-info-table" style={{ width: '100%' }}>
                        <tbody style={{ border: 'none' }}>
                        <tr>
                            <td>Session Label: <>&nbsp;</></td>
                            <td>{itemData.label}</td>
                        </tr>
                        <tr>
                            <td>Session ID: <>&nbsp;</></td>
                            <td>{itemData.session_id}</td>
                        </tr>
                        <tr>
                            <td>Subject: <>&nbsp;</></td>
                            <td>{itemData.xnat_subjectdata_subjectid}</td>
                        </tr>
                        <tr>
                            <td>Project: <>&nbsp;</></td>
                            <td>{itemData.project}</td>
                        </tr>
                        </tbody>
                    </table>
                </section>

            </header>
        );
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

                                    {/*<ViewHeader*/}
                                    {/*    data={searchResponse.data}*/}
                                    {/*    itemIndex={searchItemIndex}*/}
                                    {/*/>*/}

                                    <div className="clearfix">

                                        <ViewerIframe dataFields={extractItem(searchResponse.data)}/>

                                        <div id="session-data" style={{ width: '30%', float: 'right' }}>
                                            <div>

                                                <ViewHeader
                                                    data={searchResponse.data}
                                                    itemIndex={searchItemIndex}
                                                />

                                                <RadReadFormWrapper itemData={extractItem(searchResponse.data)} templateId={templateId}>
                                                    <section className="clearfix">
                                                        <SessionNavButton txt="prev" newIndex={searchItemIndex - 1}/>
                                                        <SessionNavButton txt="next" newIndex={searchItemIndex + 1}/>
                                                    </section>
                                                </RadReadFormWrapper>

                                                <table style={{ display: 'none' }}>
                                                    <tbody>
                                                    {(itemData = extractItem(searchResponse.data)) && Object.keys(itemData).sort().map((key, i) => {
                                                        const val = itemData[key];
                                                        return (
                                                            <tr className={(i % 2) ? 'even' : 'odd'}>
                                                                <th>{key}</th>
                                                                <td>{val}</td>
                                                            </tr>
                                                        );
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
