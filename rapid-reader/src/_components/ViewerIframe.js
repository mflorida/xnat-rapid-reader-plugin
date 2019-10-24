import React from 'react';
import { server } from '../_config/server';

function ViewerIframe(props){

    const { dataFields } = props;

    const VIEWER = 'VIEWER';

    function iframeSrc(){
        console.log('iframeSrc');
        // const dataFields = extractItem(data);
        // console.log(dataFields);
        const query  = [
            `projectId=${dataFields.project}`,
            `subjectId=${dataFields.xnat_subjectdata_subjectid}`,
            `experimentId=${dataFields.session_id}`,
            `t=${Date.now()}`
        ];
        return `${server.siteUrl}/${VIEWER}/?${query.join('&')}`
    }


    return (

        <div id="viewer-iframe" style={{ width: '70%', float: 'left' }}>
            <iframe src={iframeSrc()} title={dataFields.session_id} width="100%" height="720" style={{ border: 'none' }}/>
        </div>

    );
}

export default ViewerIframe;
