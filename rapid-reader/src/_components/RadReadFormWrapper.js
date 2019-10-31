import React from 'react';
import { Link } from 'react-router-dom';
import { server } from '../_config/server';
import { useRequest } from '../_helpers/useRequest';
import dompurify from 'dompurify';
import axios from 'axios';

import './RadReadFormStyles.css';

export default function RadReadFormWrapper(props){

    const { itemData, templateId } = props;

    const exptId = itemData.expt_id;

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

            {templateResponse && templateResponse.data && <FormTemplate/>}

            <br/>

            <input name={'project'} type={'hidden'} defaultValue={itemData.project}/>
            <input name={'subject'} type={'hidden'} defaultValue={itemData.xnat_subjectdata_subjectid}/>
            <input name={'expt_id'} type={'hidden'} defaultValue={itemData.expt_id}/>
            <input name={'modality'} type={'hidden'} defaultValue={itemData.modality}/>
            <input name={'read_template'} type={'hidden'} defaultValue={templateId}/>
            <textarea name={'other'} className={'hidden'} style={{ display: 'none' }} defaultValue={'{}'}/>

            {props.children}

            {/*<section className="clearfix">*/}
            {/*    <SessionNavButton txt="prev" newIndex={itemIndex - 1}/>*/}
            {/*    <SessionNavButton txt="next" newIndex={itemIndex + 1}/>*/}
            {/*</section>*/}

            {populateForm(templateResponse && templateResponse.data) && ''}

        </form>

    );

}