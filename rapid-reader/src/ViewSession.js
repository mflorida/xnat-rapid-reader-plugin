import React from 'react';
import { Link } from 'react-router-dom';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';
import RadReadFormWrapper from './_components/RadReadFormWrapper';
import LoadingRequest from './_components/LoadingRequest';
import ViewerIframe from './_components/ViewerIframe';
import axios from 'axios';

import './ViewSession.css';

function ViewSession(props){

    let { searchId, searchItemIndex, searchItemsLength } = props.match.params;

    const templateId = props.match.params.templateId;

    searchItemIndex = (+searchItemIndex);

    const [searchResponse, searchRequest] = useRequest({
        url: `${server.siteUrl}/data/search/saved/${searchId}/results?format=json&t=${Date.now()}`,
        method: 'GET',
        transformResponse: function(json){

            let data = (typeof json === 'string') ? JSON.parse(json) : json;

            data.ResultSet.Result = data.ResultSet.Result.map(function(item){
                item.session_id = item.session_id || item.expt_id;
                item.expt_id    = item.expt_id || item.session_id;
                return item;
            });

            console.log(data);
            
            return data;
        }
    });

    let results  = [];
    let itemData = null;

    function extractResults(data){
        console.log('extractResults');
        return (results = (data && data.ResultSet && data.ResultSet.Result) ? data.ResultSet.Result : []);
    }

    function extractItem(data){
        console.log('extractItem');
        itemData         = extractResults(data)[searchItemIndex - 1] || null;
        itemData.expt_id = itemData.expt_id || itemData.session_id;
        itemData.subject = itemData.subject || itemData.xnat_subjectdata_subjectid;
        return itemData;
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

    // const [submitResponse, submitRequest] = useRequest({
    //
    // });

    function parseSessionParam(){
        const parts = window.readerConfig.server.info[2].split(/[/_.:$?=&+\-*]+/);
        return [
            parts[4] || 0,
            parts[1] || 0,
            parts[5] || 0,
            parts[2] || 0,
            parts[3] || 0
        ].join('-')
    }

    function SaveButton(props){

        const { newIndex } = props;

        let nextItem = (newIndex <= searchItemsLength) ?
            `/worklists/${searchId}/${templateId}/${newIndex}/${searchItemsLength}` :
            '/worklists';

        const btnStyle = {
            width: '100%',
            lineHeight: 1.6
        };

        function handleSave(e){

            e.preventDefault();

            console.log('link...');
            console.log(nextItem);

            // collect the form data
            const formData = window.radreportFormData.collect('#session-data');

            console.log(formData);

            // convert to XML using the 'standard' elements for generic rad read data type
            const xmlSpawn = window.genRadReadSpawnXML(formData.sectionMap);

            console.log(xmlSpawn.xml);

            // return false;

            // submit the XML data as a new assessor
            const postXML = axios({
                method: 'POST',
                url: `${server.siteUrl}/data/projects/${itemData.project}/subjects/${itemData.subject}/experiments/${itemData.expt_id}/assessors`,
                params: {
                    inbody: 'true',
                    XNAT_CSRF: parseSessionParam()
                },
                headers: {
                    'Content-Type': 'text/xml'
                },
                data: xmlSpawn.xml
            });

            postXML.then(function(resp){
                if (resp.status === 200) {
                    console.log('SAVED!!!');
                    window.location.hash = `#${nextItem}`;
                }
                else {
                    console.warn('error')
                }
            });

        }

        return (
            <Link style={btnStyle} to={nextItem} onClick={handleSave}>
                <button style={{ width: '100%' }}>Save and Continue</button>
            </Link>
        )
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

        if (/prev/i.test(txt)) {
            disabled       = newIndex <= 0;
            text           = (<>&laquo; Back</>);
            btnStyle.float = 'left';
        }
        else {
            // disabled       = newIndex > searchItemsLength;
            text           = (<>Skip &raquo;</>);
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

        const headerStyle = {
            width: '30%',
            height: 160,
            margin: 0,
            padding: '0 10px',
            position: 'fixed',
            top: 0, right: 0,
            background: '#000',
            zIndex: 1
        };

        return (

            <header style={headerStyle}>

                <section className="clearfix" style={{ padding: '0 10px', height: 40, lineHeight: '40px', verticalAlign: 'middle' }}>
                    <div className="float-left">
                        <Link to="/worklists">
                            <b><>&laquo;&nbsp;</>Worklists</b>
                        </Link>
                    </div>
                    <div className="float-right">
                        <small>Viewing session #{searchItemIndex} of {searchItemsLength}</small>
                    </div>
                    <div className="clearfix"/>
                </section>

                <section style={{ height: 120, margin: '0 10px', padding: '10px', borderBottom: '5px solid #303030', background: '#000' }}>
                    <table id="session-info-table" style={{ width: '100%', height: '100%', fontSize: '13px', fontWeight: 'bold' }}>
                        <tbody style={{ border: 'none' }}>
                        <tr>
                            <th>Session Label: <>&nbsp;</></th>
                            <td>{itemData.label}</td>
                        </tr>
                        <tr>
                            <th>Session ID: <>&nbsp;</></th>
                            <td>{itemData.expt_id}</td>
                        </tr>
                        <tr>
                            <th>Subject: <>&nbsp;</></th>
                            <td>{itemData.subject}</td>
                        </tr>
                        <tr>
                            <th>Project: <>&nbsp;</></th>
                            <td>{itemData.project}</td>
                        </tr>
                        </tbody>
                    </table>
                </section>

            </header>
        );
    }

    return (
        <div className="view-session" style={{ margin: 0 }}>
            {!searchResponse || !searchResponse.data ? (

                <LoadingRequest req={searchRequest}/>

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
                                    {extractItem(searchResponse.data) && null}

                                    {/*<ViewHeader*/}
                                    {/*    data={searchResponse.data}*/}
                                    {/*    itemIndex={searchItemIndex}*/}
                                    {/*/>*/}

                                    <div className="clearfix">

                                        <ViewerIframe dataFields={itemData}/>

                                        <div id="session-data" style={{
                                            width: '30%',
                                            position: 'absolute',
                                            top: '160px',
                                            right: 0,
                                            bottom: 0,
                                            overflowY: 'scroll',
                                            padding: '0 10px'
                                        }}>
                                            <div>

                                                <ViewHeader
                                                    data={searchResponse.data}
                                                    itemIndex={searchItemIndex}
                                                />

                                                <RadReadFormWrapper itemData={itemData} templateId={templateId}>
                                                    <section className="clearfix" style={{ padding: '0 20px 30px' }}>
                                                        <SessionNavButton txt="prev" newIndex={searchItemIndex - 1}/>
                                                        <SessionNavButton txt="next" newIndex={searchItemIndex + 1}/>
                                                        <div className="clearfix"/>
                                                        <br/>
                                                        <SaveButton newIndex={searchItemIndex + 1}/>
                                                    </section>
                                                </RadReadFormWrapper>

                                                <table style={{ display: 'none' }}>
                                                    <tbody>
                                                    {Object.keys(itemData).sort().map((key, i) => {
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
