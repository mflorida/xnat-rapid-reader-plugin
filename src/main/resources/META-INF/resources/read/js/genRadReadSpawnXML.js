(function(window){

    var x0 = window.x0;

    var server = window.readerConfig.server;

    function schemaLocation(){
        return [
            'http://nrg.wustl.edu/workflow __SITE_URL__/xapi/schemas/workflow ',
            'http://nrg.wustl.edu/catalog __SITE_URL__/schemas/catalog.xsd ',
            'http://nrg.wustl.edu/pipe __SITE_URL__/schemas/repository.xsd ',
            // 'http://nrg.wustl.edu/rad __SITE_URL__/schemas/radRead.xsd ',
            'http://nrg.wustl.edu/scr __SITE_URL__/schemas/screeningAssessment.xsd ',
            'http://nrg.wustl.edu/arc __SITE_URL__/schemas/project.xsd ',
            'http://icr.ac.uk/icr __SITE_URL__/schemas/roi.xsd ',
            'http://nrg.wustl.edu/xnat __SITE_URL__/schemas/xnat.xsd ',
            'http://nrg.wustl.edu/val __SITE_URL__/schemas/protocolValidation.xsd ',
            'http://nrg.wustl.edu/rad __SITE_URL__/schemas/genRadRead.xsd ',
            'http://nrg.wustl.edu/xnat_assessments __SITE_URL__/schemas/assessments.xsd ',
            'http://www.nbirn.net/prov __SITE_URL__/schemas/birnprov.xsd ',
            'http://nrg.wustl.edu/security __SITE_URL__/schemas/security.xsd'
        ].join(' ').replace(/__SITE_URL__/g, server.siteUrl);
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

        var projAttr = (data.project || data.projectId || window.projectId) ?
            data.project || data.projectId || window.projectId :
            '';

        var attrs = {
            'xmlns:wrk': 'http://nrg.wustl.edu/workflow',
            'xmlns:scr': 'http://nrg.wustl.edu/scr',
            'xmlns:rad': 'http://nrg.wustl.edu/rad',
            'xmlns:xnat': 'http://nrg.wustl.edu/xnat',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
        };

        if (projAttr) {
            attrs.project = projAttr;
        }

        attrs['xsi:schemaLocation'] = schemaLocation();

        return attrs;

    }


    // main Spawner function
    function genRadReadSpawnXML(data){

        data = data || {};

        data.other = data.other || {};

        function templateElement(tag, attr, content){
            return [tag, attr, content];
        }

        function radElement(name, attr, value){
            return templateElement(
                'rad:' + x0.toUnderscore(name),
                attr ? attr : null,
                value || ''
            );
        }

        function radDataElement(name, attr){
            return radElement(name, attr || null, jsonString(data[name]) || '');
        }

        var xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

        var spawned = x0.spawnXML('rad:GenRadiologyRead', rootAttrs(data), [

            templateElement('xnat:imageSession_ID', null, data.expt_id),
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

            radDataElement('findings', { normal_status: '1' }),
            // radDataElement('finding', { normal_status: '1' }),
            // ['rad:finding', { attr: { normal_status: '1' } }, jsonString(data.finding)],

            radDataElement('diagnosis'),
            // ['rad:diagnosis', jsonString(data.diagnosis)],

            radDataElement('impression'),
            // ['rad:impression', jsonString(data.impression)],

            radElement('read_template', null, '1'),
            // ['rad:read_template', '1'],

            radElement('other', null, jsonString((function(itemData){

                var other = itemData.other || {};

                other.project  = (other.project || itemData.project || '');
                other.subject  = (other.subject || itemData.subject || '');
                other.expt_id  = (other.expt_id || itemData.expt_id || itemData.exptId || itemData.imageSessionId || itemData.imageSession_ID || '');
                other.modality = (other.modality || itemData.modality || '');
                other.reader   = (other.reader || itemData.reader || itemData.username || itemData.user || '');

                return other;

            })(data))),
            // ['rad:other', jsonString(data.other)],

            ''
        ]);

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
        };
    }

    window.genRadReadSpawnXML = genRadReadSpawnXML;

})(this);
