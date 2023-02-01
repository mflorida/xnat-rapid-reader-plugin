import React from 'react';
import { server } from '../_config/server';

/**
 * React component to use for populating XML template data with React props
 * @param props
 * @returns {*}
 * @constructor
 */
export default function GenRadReadDataXMLTemplate(props){

    const x0 = window.x0 || {};

    function schemaLocation(){

        let attrStr = [
            `http://nrg.wustl.edu/workflow ${server.siteUrl}/xapi/schemas/workflow `,
            `http://nrg.wustl.edu/catalog ${server.siteUrl}/schemas/catalog.xsd `,
            `http://nrg.wustl.edu/pipe ${server.siteUrl}/schemas/repository.xsd `,
            `http://nrg.wustl.edu/rad ${server.siteUrl}/schemas/radRead.xsd `,
            `http://nrg.wustl.edu/scr ${server.siteUrl}/schemas/screeningAssessment.xsd `,
            `http://nrg.wustl.edu/arc ${server.siteUrl}/schemas/project.xsd `,
            `http://icr.ac.uk/icr ${server.siteUrl}/schemas/roi.xsd `,
            `http://nrg.wustl.edu/xnat ${server.siteUrl}/schemas/xnat.xsd `,
            `http://nrg.wustl.edu/val ${server.siteUrl}/schemas/protocolValidation.xsd `,
            `http://nrg.wustl.edu/rad ${server.siteUrl}/schemas/genRadRead.xsd `,
            `http://nrg.wustl.edu/rad_extra ${server.siteUrl}/schemas/genRadReadExtra.xsd `,
            `http://nrg.wustl.edu/xnat_assessments ${server.siteUrl}/schemas/assessments.xsd `,
            `http://www.nbirn.net/prov ${server.siteUrl}/schemas/birnprov.xsd `,
            `http://nrg.wustl.edu/security ${server.siteUrl}/schemas/security.xsd`
        ];

        return attrStr.join(' ').replace(/\s+/g, ' ');
    }

    function processElementFields(element, keyMap){
        let tmpObj = {};
        Object.keys(keyMap).forEach((key, i) => {
            let prop    = keyMap[key];
            tmpObj[key] = element[prop];
        });
        return JSON.stringify(tmpObj);
    }

    function isPlainObject(it){
        return Object.prototype.toString.call(it) === '[object Object]';
    }

    function toString(it){
        if (it === '' || it === undefined) return '';
        return (Array.isArray(it) || isPlainObject(it)) ?
            JSON.stringify(it) :
            (it + '');
    }


    return (

        <rad:GenRadiologyRead
            xmlns:wrk={'http://nrg.wustl.edu/workflow'}
            xmlns:scr={'http://nrg.wustl.edu/scr'}
            xmlns:rad={'http://nrg.wustl.edu/rad'}
            xmlns:xnat={'http://nrg.wustl.edu/xnat'}
            xmlns:xsi={'http://www.w3.org/2001/XMLSchema-instance'}
            project={props.projectId}
            xsi:schemaLocation={schemaLocation()}>

            <xnat:imageSession_ID>
                {props.exptId}
            </xnat:imageSession_ID>

            <rad:modality>
                {props.modality}
            </rad:modality>

            <rad:reader>
                {props.username}
            </rad:reader>

            <rad:procedure>
                {toString(props.data.procedure)}
            </rad:procedure>

            <rad:technique>
                {toString(props.data.technique)}
            </rad:technique>

            <rad:clinical_info>
                {toString(props.data.clinical_info)}
            </rad:clinical_info>

            <rad:comparison>
                {toString(props.data.comparison)}
            </rad:comparison>

            <rad:findings normal_status={props.data.findings.normal_status || '1'}>
                {toString(props.data.findings)}
            </rad:findings>

            <rad:diagnosis>
                {toString(props.data.diagnosis)}
            </rad:diagnosis>

            <rad:impression>
                {toString(props.data.impression)}
            </rad:impression>

            <rad:read_template>
                {props.data.read_template}
            </rad:read_template>

            <rad:other>
                {toString(props.data.other)}
            </rad:other>

        </rad:GenRadiologyRead>

    );
}