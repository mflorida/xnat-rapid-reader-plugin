(function(window){

    // localize x0 main function/methods
    var x0 = window.x0;

    // object to hold collected data
    var readData = {
        // quick access to data by template field id
        dataMap: {},
        // organized section data
        sections: {}
    };

    var inputSelectors = [
        'input',
        'select',
        'textarea'
    ];


    // get section data for each <section> element in template
    function gatherSectionData(container){

        var sections = getElements('section[data-section-name]', container);

        x0.forEach(sections, function(section, i){

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
                normalizedName = x0.toUnderscore(sectionName);
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

            x0.forEach(inputs, function(input, i){

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

                var itemAttrs = x0(input).attr();

                // iterate through the element's attributes, then normalize and save as a new object
                x0.forOwn(itemAttrs, function(attrName, attrValue){

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
                itemData.key = x0.toUnderscore(itemData.name);

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
            readData.sections[normalizedName] = sectionData;

        });

        return readData;

    }
    window.gatherSectionData = gatherSectionData;


    // fill in html template fields with stored data
    function populateSectionFields(container){

    }


    // utility functions
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
        return resolveContext(context).querySelectorAll(selector);
    }

})(this);
