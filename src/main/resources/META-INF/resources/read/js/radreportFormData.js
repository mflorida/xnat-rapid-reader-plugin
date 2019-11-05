/**
 * Collect and populate form data using 'TLAP Endorsed'
 * form templates available on radreport.org.
 */

(function(window){

    window.radreportFormData = window.radreportFormData || {};

    // object to hold collected data
    var readData = {
        // quick access to data by template field id
        dataMap: {},
        // organized section data
        sections: [],
        // quick access to section by name
        sectionMap: {}
    };

    var inputSelectors = [
        'input',
        'select',
        'textarea'
    ];


    // get section data for each <section> element in template
    function collect(container){

        var dataSections = getElements('section[data-section-name]', container);

        dataSections.forEach(function(section, i){

            var sectionName = section.getAttribute('data-section-name');

            var normalizedName = sectionName;

            // special handling of 'clinical_info' section to handle variations
            // like 'clinical_information' or 'Clinical Information' or 'clinical-info' or...
            if (/^clinical[_\W]*info.*/i.test(sectionName)) {
                normalizedName = 'clinical_info';
            }
            else if (/^finding/i.test(sectionName)) {
                // make sure to store as findings (plural)
                normalizedName = 'findings';
            }
            else {
                // convert to lowercase underscored names
                normalizedName = underscoreString(sectionName);
            }

            // if there's a <header> element, use that as the section label
            var sectionHeader = getElement('header:first-of-type', section);
            var sectionLabel  = sectionHeader.textContent.trim() || sectionName;
            var sectionTitle  = section.title || sectionHeader.title || sectionLabel;

            // each section holds an array of values
            var sectionData = {
                section: normalizedName,
                name: sectionName,
                label: sectionLabel,
                title: sectionTitle,
                data: {},
                dataMap: {},
                dataFields: []
            };

            var inputs = getElements(inputSelectors.join(','), section);

            inputs.forEach(function(input, i){

                var itemData = {};

                // name should be the 'name' attribute, but could be something else
                itemData.name = input.name || input.id || input.title;
                itemData.id   = input.id || itemData.name;

                itemData.title = input.title || input.name || input.id;

                // try to find the label for this input element
                itemData.label = (getElement('label[for="' + itemData.id + '"]', section) || { textContent: itemData.title }).textContent;

                // save the tagName as well
                itemData.tagName = input.tagName;
                itemData.tag     = itemData.tagName.toLowerCase();

                // // special handling for <select> elements (?)
                // if (/^select$/i.test(itemData.tag)) {
                //
                // }

                // add extra attributes to the '$attr' object
                itemData.$attr = {};

                var itemAttrs = itemsToArray(input.getAttributeNames());

                // iterate through the element's attributes, then normalize and save as a new object
                itemAttrs.forEach(function(attrName, i){

                    var attrValue = input.getAttribute(attrName);

                    // // make sure property name is lowercase (?)
                    // attrName = attrName.toLowerCase();

                    // if a name is not yet set, use the first attribute
                    // with 'name' in it (could be a custom [data-*] attribute)
                    if (!itemData.name && /name/i.test(attrName)) {
                        itemData.name = attrName;
                    }
                    else {
                        // only add attributes not already saved
                        if (!itemData.hasOwnProperty(attrName)) {
                            itemData.$attr[attrName] = attrValue;
                        }
                    }

                    // if (/^data-/i.test(attrName)) {
                    //     // pull out [data-*] attributes into a `data: {}` child object?
                    //
                    //     itemData.data =
                    //         x0.getObject(itemData.data);
                    //
                    //     itemData.data[x0.toCamelCase(attrName.replace(/^data-/i, ''))] =
                    //         attrValue;
                    // }

                });

                // transform 'name' to underscored string for the key
                itemData.key = underscoreString(itemData.name);

                // make sure we have a VALUE defined!!!
                itemData.value = input.value || itemData.value || '';



                ////////// COLLECT VALUES //////////


                // save in 'data' object by name for easy reference
                sectionData.data[itemData.key] = itemData;

                // save as a map by id
                sectionData.dataMap[itemData.id] = itemData;

                // save an array of data fields to preserve order?
                sectionData.dataFields.push(itemData);

                // top-level properties keyed by template field id
                readData.dataMap[itemData.id] = itemData;

            });

            // add section data to the main data object
            readData.sections.push(sectionData);
            readData.sectionMap[normalizedName] = sectionData.dataMap;

        });

        return readData;

    }
    window.radreportFormData.collect = collect;


    // fill in html template fields with stored data
    function populate(container, data){

        var formData      = possiblyJSON(data);
        var dataArray     = Array.isArray(formData) ? formData : [];
        var formContainer = getElement(container);
        var form          = (/FORM/i.test(formContainer.nodeName) ? formContainer : getElement('form', container));
        var sections      = getElements('section[data-section-name]', form);
        var inputs        = getElements('input[name], input[id], select, textarea', form);

        // save all data by id, regardless of 'section'
        var dataMap       = {};

        // convert formData object to an array
        if (isPlainObject(formData)) {
            dataArray = Object.keys(formData).map(function(key){

                var dataItem = {};
                var dataValue = possiblyJSON(formData[key]);

                dataItem.key = key;
                dataItem.id  = dataItem.id || key;
                dataItem[key] = dataValue;

                // save to dataMap before return
                if (isPlainObject(possiblyJSON(dataValue))) {
                    Object.keys(dataValue).forEach(function(dataKey){
                        dataMap[dataKey] = dataValue[dataKey].value || '';
                    })
                }

                return dataItem;
            });
        }

        window.jsdebug && console.log(dataArray);

        // iterate the form elements instead of the data
        (inputs).forEach(function(input){
            var key = input.id || input.name;
            var value = '';
            // skip buttons and inputs without names or ids
            if (key) {
                value = dataMap[key];
                if (/SELECT/i.test(input.nodeName)) {
                    selectOption(input, value);
                }
                else {
                    input.value = value;
                }
            }
        });

        // dataArray.forEach(function(dataItem, i){
        //
        //     var fieldInput = inputs[dataItem.id] || inputs[dataItem.name];
        //     var fieldValue = dataItem.value;
        //
        //     if (/SELECT/i.test(fieldInput.nodeName)) {
        //         selectOption(fieldInput, fieldValue);
        //     }
        //     else {
        //         fieldInput.value = fieldValue;
        //     }
        //
        // });

        return [form, inputs, formData, inputs];

    }
    window.radreportFormData.populate = populate;





    // utility functions

    function probablyJSON(it){
        return /string/i.test(typeof it) && /^[{[]/.test((it + '').trim());
    }

    function possiblyJSON(it){
        return it && probablyJSON(it) ? JSON.parse(it) : it || '';
    }

    function selectOption(select, value){
        itemsToArray(select.options).forEach(function(option, i){
            option.selected = (option.value === (value + ''));
        });
    }

    function itemsToArray(items){
        return Array.isArray(items) ?
            items :
            typeof items !== 'string' && 'length' in items ?
                Array.prototype.slice.call(items) :
                [items];
    }

    // convert all characters that aren't letters or numbers
    // to underscores and trim any leading or trailing underscores
    function underscoreString(name){
        return (name || '').replace(/[^a-z0-9]/gi, '_')
                           .replace(/_+/g, '_')
                           .replace(/^_+|_+$/g, '')
                           .toLowerCase();
    }

    function resolveContext(context){
        var parent = document;
        if (context) {
            if (typeof context === 'string') {
                parent = document.querySelector(context);
            }
            else if (context instanceof Element) {
                parent = context;
            }
        }
        return parent;
    }

    function getElement(selector, context){
        return resolveContext(context).querySelector(selector);
    }

    function getElements(selector, context){
        var selected = resolveContext(context).querySelectorAll(selector);
        console.log(selected);
        return itemsToArray(selected);
    }
    window.radreportFormData.getElements = getElements;

    function isPlainObject(it){
        return Object.prototype.toString.call(it) === '[object Object]';
    }



    return window.radreportFormData;


})(this);
