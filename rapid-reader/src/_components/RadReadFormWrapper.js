import React from 'react';
import { Link } from 'react-router-dom';
import { server } from '../_config/server';
import { useRequest } from '../_helpers/useRequest';
import dompurify from 'dompurify';
import axios from 'axios';

import './RadReadFormStyles.css';

export default function RadReadFormWrapper(props){

    const { itemData, templateId } = props;

    // omit template id from worklist or use '-' (hyphen) or '0' to be explicit about not using a template
    let useForm = templateId && /^[^-0]/i.test(templateId);

    const localRegex = /^[*~:/]/;

    // prefix template id with '*' or ':' to use a locally-stored template
    // either as a stored XNAT resource file or other accessible html file
    const isLocalForm = localRegex.test(templateId);

    // use a form template from '/read/forms/Template_Name.html'
    // *Template_Name
    let formFile = `${server.appUrl}/forms/${templateId.replace(localRegex, '').replace(/\.html$/, '')}.html`;
    //
    console.log(formFile);
    
    // use a form stored as a resource on the server?
    // use the full url with colons ':' instead of '/' in the url path
    // :data:projects:AbCTSeg:resources:4664:files:Thoraxfoto.html
    let formResource = (`${server.siteUrl}/${templateId.replace(localRegex, '').replace(/[:]/g, '/').replace(/\/+/, '/')}`);
    //
    console.log(formResource);

    let templateUrl = isLocalForm ?
        (templateId.charAt(0) === '*' ? formFile : formResource) :
        `https://phpapi.rsna.org/radreport/v1/templates/${templateId}/details`;
    //
    console.log(templateUrl);

    if (/[-0]/i.test(templateId)) {
        templateUrl = '';
    }

    const [templateResponse, templateRequest] = useRequest({
        url: templateUrl,
        method: 'GET'
    }, templateId);

    const exptId = itemData.expt_id;

    // const [dataResponse, dataRequest] = useRequest({
    //     url: `${server.siteUrl}/data/`,
    //     method: 'GET'
    // }, exptId);

    function FormTemplate(){
        const templateHTML = isLocalForm ? templateResponse.data : templateResponse.data.DATA.templateData;
        const templateBody = /<body>/.test(templateHTML) ? templateHTML.split('<body>')[1].split('</body>')[0] : templateHTML;
        return (
            <div
                id="read-form-template"
                style={{ padding: '10px' }}
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(templateBody) }}
            />
        );
    }

    // populate form fields if there's assessor data stored
    function populateForm(go){
        if (useForm && go) {

            const getAssessors = axios({
                url: `${server.siteUrl}/data/experiments/${itemData.expt_id}/assessors?xsiType=rad:genRadiologyReadData&format=json`,
                method: 'GET'
            }).then(function(resp){
                return (resp && resp.data && resp.data.ResultSet && resp.data.ResultSet.Result) ? resp.data.ResultSet.Result : [];
            });

            getAssessors.then(function(assessors){
                if (assessors.length > 0) {
                    let lastIndex = assessors.length - 1;
                    let lastId    = assessors[lastIndex].ID;
                    axios({
                        url: `${server.siteUrl}/data/experiments/${itemData.expt_id}/assessors/${lastId}?format=json`,
                        method: 'GET'
                    }).then(function(resp){
                        if (resp && resp.data && resp.data.items && resp.data.items[0] && resp.data.items[0].data_fields) {
                            const result = window.radreportFormData.populate('#form-template-wrapper', resp.data.items[0].data_fields);
                            console.log(result);
                        }
                    });
                }
            });

        }
    }

    return (

        <form id="form-template-wrapper" action="#!" style={{ paddingTop: '5px' }}>

            {useForm && templateResponse && templateResponse.data && <FormTemplate/>}

            <br/>

            <input name={'project'} type={'hidden'} defaultValue={itemData.project}/>
            <input name={'subject'} type={'hidden'} defaultValue={itemData.xnat_subjectdata_subjectid}/>
            <input name={'expt_id'} type={'hidden'} defaultValue={itemData.expt_id}/>
            <input name={'modality'} type={'hidden'} defaultValue={itemData.modality}/>
            <input name={'read_template'} type={'hidden'} defaultValue={templateId}/>
            <textarea name={'other'} className={'hidden'} style={{ display: 'none' }} defaultValue={'{}'}/>

            {props.children}

            {useForm && populateForm(templateResponse && templateResponse.data) && ''}

        </form>

    );

}