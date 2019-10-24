(function(axios){

    // using a map of element selectors and their associatd values,
    // construct an XML data document from a template

    function isPlainObject(it){
        return Object.prototype.toString.call(it) === '[object Object]';
    }

    // fetch the XML template
    function getXmlTemplate(url){
        return axios.get(url).then((response) => {
            console.log('getXmlTemplate');
            console.log(response);
            return response.data;
        });
    }

    // syntax used in XML doc (key name inside comment node)
    function templateVar(key){
        return '{{__' + key.toUpperCase() + '__}}';
    }

    // strip XML comments before submission?
    function stripComments(xmlString){
        return xmlString.replace(/(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, function(match, offset, str){
            return match.trim();
        });
    }

    function replaceTemplateVars(xml, obj){
        var xmlString = (/^string$/i.test(typeof xml)) ? xml : (new XMLSerializer()).serializeToString(xml);
        Object.keys(obj).forEach((key, i) => {
            var val = obj[key];
            if (Array.isArray(val) || isPlainObject(val)) {
                val = JSON.stringify(val, null, 2);
            }
            xmlString = xmlString.replace(templateVar(key), val);
        });
        console.log(xmlString);
        xmlString = stripComments(xmlString);
        console.log(xmlString);
        return xmlString;
    }

    // parse XML doc and use selector syntax to modify element contents and attributes
    function populateElements(xml, obj){

    }

    function submitXML(xmlUrl, xmlData, submitUrl, method){

        console.log(xmlData);

        function doSubmit(XML){
            return axios({
                url: submitUrl,
                method: method || 'POST',
                data: XML
            }).then((response) => {
                console.log('submitXML');
                console.log(response);
                if (response.status === 200) {
                    console.log('XML submitted');
                }
                return response;
            });
        }

        // if there's an `xmlUrl` argument for an XML template file...
        if (xmlUrl && typeof xmlData !== 'string') {
            // get the XML template, replace the template variables
            // then POST the XML
            return getXmlTemplate(xmlUrl).then((xmlTmpl) => {
                return doSubmit(replaceTemplateVars(xmlTmpl, xmlData))
            })
        }

        else {
            // POST the XML string
            return doSubmit(xmlData);
        }

    }

    window.submitXML = submitXML;


    // get values from form fields to submit as XML (spawned or using a template file)
    function submitFormXML(e){

        e.preventDefault();

        var form = e.target;

        var formData = [].slice.call(form.elements).map((element, i) => {
            if (!element.className.contains('skip')) {
                return  {
                    fieldId: element.id,
                    name: element.name,
                    value: element.value,
                    description: ''
                }
            }
        });

        console.log(formData);

    }

})(window.axios);
