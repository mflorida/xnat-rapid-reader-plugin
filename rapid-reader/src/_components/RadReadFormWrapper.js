import React from 'react';
import { server } from '../_config/server';
import { useRequest } from '../_helpers/useRequest';
import dompurify from 'dompurify';

import './RadReadFormStyles.css';

export default function RadReadFormWrapper(props){

    const templateId = props.template;

    const [templateResponse, templateRequest] = useRequest({
        url: `https://phpapi.rsna.org/radreport/v1/templates/${templateId}/details`,
        method: 'GET'
    }, templateId);

    function FormTemplate(){
        const templateBody = templateResponse.data.DATA.templateData.split('<body>')[1].split('</body>')[0];
        return (
            <div id="read-form-template" dangerouslySetInnerHTML={{ __html: dompurify.sanitize(templateBody) }}/>
        );
    }

    return (

        <form id="form-template-wrapper" action="#!">

            {templateResponse && templateResponse.data && <FormTemplate/>}

            <br/>
            <br/>
            <button type="submit">Save and Continue</button>
            <br/>
            <br/>
        </form>

    );

}