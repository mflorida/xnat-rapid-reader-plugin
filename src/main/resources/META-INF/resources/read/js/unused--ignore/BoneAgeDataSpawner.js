(function(window){

    var server = window.readerConfig.server;

    function schemaLocation(){
        return [
            `http://nrg.wustl.edu/workflow ${server.siteUrl}/xapi/schemas/workflow `,
            `http://nrg.wustl.edu/catalog ${server.siteUrl}/schemas/catalog.xsd `,
            `http://nrg.wustl.edu/pipe ${server.siteUrl}/schemas/repository.xsd `,
            // `http://nrg.wustl.edu/rad ${server.siteUrl}/schemas/radRead.xsd `,
            `http://nrg.wustl.edu/scr ${server.siteUrl}/schemas/screeningAssessment.xsd `,
            `http://nrg.wustl.edu/arc ${server.siteUrl}/schemas/project.xsd `,
            `http://icr.ac.uk/icr ${server.siteUrl}/schemas/roi.xsd `,
            `http://nrg.wustl.edu/xnat ${server.siteUrl}/schemas/xnat.xsd `,
            `http://nrg.wustl.edu/val ${server.siteUrl}/schemas/protocolValidation.xsd `,
            `http://nrg.wustl.edu/rad ${server.siteUrl}/schemas/genRadRead.xsd `,
            `http://nrg.wustl.edu/xnat_assessments ${server.siteUrl}/schemas/assessments.xsd `,
            `http://www.nbirn.net/prov ${server.siteUrl}/schemas/birnprov.xsd `,
            `http://nrg.wustl.edu/security ${server.siteUrl}/schemas/security.xsd`
        ].join(' ');
    }

    function processElementFields(element, keyMap){
        let tmpObj = {};
        Object.keys(keyMap).forEach((key, i) => {
            let prop    = keyMap[key];
            tmpObj[key] = element[prop];
        });
        return JSON.stringify(tmpObj);
    }


    function jsonString(it){
        if (it === '' || it === undefined) return '';
        return (x0.isArray(it) || x0.isPlainObject(it)) ?
            JSON.stringify(it) :
            (it + '');
    }
    
    
    function rootAttrs(data){
        return {
            'xmlns:wrk': "http://nrg.wustl.edu/workflow",
            'xmlns:scr': "http://nrg.wustl.edu/scr",
            'xmlns:rad': "http://nrg.wustl.edu/rad",
            'xmlns:xnat': "http://nrg.wustl.edu/xnat",
            'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
            'project': data.projectId || '',
            'xsi:schemaLocation': schemaLocation()
        }
    }


    // main Spawner function
    function boneAgeTemplateXML(data){

        function templateElement(tag, attr, content){
            return [tag, attr, content]
        }

        function radElement(name, attr, value){
            return templateElement(
                'rad:' + x0.toUnderscore(name).toLowerCase(),
                attr ? attr : null,
                value || ''
            )
        }

        function radDataElement(name, attr) {
            return radElement(name, attr || null, jsonString(data[name]) || '')
        }


        var spawned = x0.spawnXML('rad:GenRadiologyRead', rootAttrs(data), [

            templateElement('xnat:imageSession_ID', null, data.exptId),
            // ['xnat:imageSession_ID', data.exptId],

            radElement('modality', null, data.modality),
            // ['rad:modality', data.modality],

            radElement('reader', null, data.username),
            // ['rad:reader', data.username],

            radDataElement('procedure'),
            // ['rad:procedure', jsonString(data.procedure)],

            radDataElement('technique'),
            // ['rad:technique', jsonString(data.technique)],

            radDataElement('clinical_info'),
            // ['rad:clinical_info', jsonString(data.clinical_info)],

            radDataElement('comparison'),
            // ['rad:comparison', jsonString(data.comparison)],

            radDataElement('findings'),
            // radDataElement('finding', { normal_status: '1' }),
            // ['rad:finding', { attr: { normal_status: '1' } }, jsonString(data.finding)],

            radDataElement('diagnosis'),
            // ['rad:diagnosis', jsonString(data.diagnosis)],

            radDataElement('impression'),
            // ['rad:impression', jsonString(data.impression)],

            radElement('read_template', null, '000101'),
            // ['rad:read_template', '000101'],

            ''
        ]);

        var xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

        var spawnedXML = [xmlHeader, spawned].join('\n');

        return {
            spawned: spawned,
            header: xmlHeader,
            body: spawned,
            xml: spawnedXML,
            spawnedXML: spawnedXML,
            get: function(){
                return spawnedXML;
            }
        }
    }

    window.boneAgeTemplateXML = boneAgeTemplateXML;

})(this);
