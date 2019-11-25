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
            `experimentId=${dataFields.expt_id}`,
            `t=${Date.now()}`
        ];
        return `${server.siteUrl}/${VIEWER}/?${query.join('&')}`
    }

    // pull this out for easier editing
    const viewerContainerStyle = {
        width: '75%',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        minHeight: 720
    };

    return (

        <div id="viewer-iframe-container" style={viewerContainerStyle}>
            <iframe src={iframeSrc()} title={dataFields.expt_id} width="100%" height="100%" style={{ border: 'none' }}/>
        </div>

    );
}

export default ViewerIframe;
