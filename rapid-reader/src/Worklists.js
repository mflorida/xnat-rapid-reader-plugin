import React from 'react';
import { server } from './_config/server';
import { useRequest } from './_helpers/useRequest';
import LoadingRequest from './_components/LoadingRequest';

function Worklists(props){

    console.log(props);

    const [response, request] = useRequest({
        url: `${server.siteUrl}/data/search/saved?format=json&t=${Date.now()}`,
        method: 'GET'
    });

    function isWorkList(item){
        return (/^(read|worklist)/i.test(item.brief_description) || /^(rapid reader|worklist)/i.test(item.description)) && /SessionData$/i.test(item.root_element_name);
    }

    function isRadreportTemplate(desc){
        return /template\s*source[:\s]+radreport/.test(desc)
    }

    function parseDescription(desc){
        return desc.split(/worklist/i).slice(1).join('').split(/[,]/).map(function(part, i){
            return (part.replace(/^[\W,]+|[\W,]+$/g, '').trim())
        }).filter(item => !!item);

    }

    function worklistConfig(item){

        const cfg = {
            isWorkList: isWorkList(item)
        };

        parseDescription(item.description).forEach(function(part, i){
            let key = part.split(/[:=]/)[0].trim().replace(/[\W\s]+/, '_').toLowerCase();
            let val = part.split(/[:=]/)[1].trim();
            cfg[key] = val.trim();
        });

        return cfg;

    }


    function renderWorklists(data){
        return (data.ResultSet && data.ResultSet.Result) ? data.ResultSet.Result.map(function(item){

                // only return searches that start with 'read' that contain 'SessionData' search results
                if (isWorkList(item)) {

                    const titleParts = item.brief_description.split(/[:|]/);

                    const config = worklistConfig(item);
                    console.log(config);

                    let searchId   = item.id;
                    let templateId = (titleParts[2] || '').trim() || '-';
                    let label      = (titleParts[1] || titleParts[0] || `Read Data (${item.root_element_name})`).trim();

                    if (config.template_id) {
                        templateId = config.template_id;
                    }
                    else if (config.template_url) {
                        templateId = config.template_url.replace(/\/+/g, ':');
                    }

                    return (
                        <a className="list-group-item list-group-item-action text-white bg-dark" href={`#/worklists/${searchId}/${templateId}/`}>{label}</a>
                    );

                }
            }
        ) : '';
    }

    return (
        <div className="stored-searches" style={{ width: 600, margin: '20px auto' }}>

            <h1>Worklists</h1>
            {!response || !response.data ? (

                <LoadingRequest/>

            ) : (
                <div className="list-group">
                    {renderWorklists(response.data)}
                    {console.log(request)}
                </div>
            )}

        </div>
    );
}

export default Worklists;
