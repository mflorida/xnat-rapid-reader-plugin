import React from 'react';
import axios from 'axios';

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
        return response.data
    })
}

// syntax used in XML doc (key name inside curly braces)
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
    let xmlString = (/^string$/i.test(typeof xml)) ? xml : (new XMLSerializer()).serializeToString(xml);
    Object.keys(obj).forEach((key, i) => {
        let val = obj[key];
        if (Array.isArray(val) || isPlainObject(val)) {
            val = JSON.stringify(val, null, 2);
        }
        xmlString = xmlString.replace(templateVar(key), val)
    });
    console.log(xmlString);
    xmlString = stripComments(xmlString);
    console.log(xmlString);
    return xmlString;
}

// parse XML doc and use selector syntax to modify element contents and attributes
function populateElements(xml, obj){

}

export function submitXML(xmlUrl, data, submitUrl, method){
    // get the XML template, replace the template variables
    // then POST the XML
    return getXmlTemplate(xmlUrl).then((xml) => {
        axios({
            url: submitUrl,
            method: method || 'POST',
            data: replaceTemplateVars(xml, data)
        }).then((response) => {
            console.log('submitXML');
            console.log(response);
            if (response.status === 200) {
                console.log('XML submitted');
            }
            return response;
        })
    })
}

window.submitXML = submitXML;