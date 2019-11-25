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
    const useForm = templateId && !/^[-0]$/.test(templateId);

    // prefix template id with an underscore to use a locally-stored template - store in /public/forms
    const localForm = templateId.charAt(0) === '_';

    const templateUrl = localForm ?
        `${server.appUrl}/forms/${templateId}.html` :
        `https://phpapi.rsna.org/radreport/v1/templates/${templateId}/details`;

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
        const templateHTML = templateResponse.data.DATA.templateData;
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
        if (go) {

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