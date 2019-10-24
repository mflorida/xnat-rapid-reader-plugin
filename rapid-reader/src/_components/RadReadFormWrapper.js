import React from 'react';
import { Link } from 'react-router-dom';
import { server } from '../_config/server';
import { useRequest } from '../_helpers/useRequest';
import dompurify from 'dompurify';

import './RadReadFormStyles.css';

export default function RadReadFormWrapper(props){

    const { itemData, templateId } = props;

    const exptId = itemData.session_id;

    const [templateResponse, templateRequest] = useRequest({
        url: `https://phpapi.rsna.org/radreport/v1/templates/${templateId}/details`,
        method: 'GET'
    }, templateId);

    // const [dataResponse, dataRequest] = useRequest({
    //     url: `${server.siteUrl}/data/`,
    //     method: 'GET'
    // }, exptId);

    function FormTemplate(){
        const templateBody = templateResponse.data.DATA.templateData.split('<body>')[1].split('</body>')[0];
        return (
            <div
                id="read-form-template"
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(templateBody) }}
            />
        );
    }

    return (

        <form id="form-template-wrapper" action="#!" style={{ margin: 20 }}>

            {templateResponse && templateResponse.data && <FormTemplate/>}

            <br/>

            {props.children}

            {/*<section className="clearfix">*/}
            {/*    <SessionNavButton txt="prev" newIndex={itemIndex - 1}/>*/}
            {/*    <SessionNavButton txt="next" newIndex={itemIndex + 1}/>*/}
            {/*</section>*/}

        </form>

    );

}