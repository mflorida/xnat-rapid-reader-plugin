/*!
 * Micro library with basic JS utility and DOM functions.
 * Leaner and faster than jQuery, but more limited scope.
 */

(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        return factory();
    }
}(function(){

    // BE NOTHING
    var undef;

    // DO NOTHING
    function noop(){}


    var useClassList = !!document.head.classList;
    var useDataset   = !!document.head.dataset;


    // Avoid console errors in browsers that lack a console.
    (function(){
        var method;
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length  = methods.length;
        var console = (window.console = window.console || {});
        var i       = 0;
        while (length--) {
            method = methods[i++];
            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());


    function hasOwn(obj, prop){
        return obj.hasOwnProperty(prop);
    }


    var isArray = Array.isArray || function(it){
        return Object.prototype.toString.call(it) === '[object Array]';
    };


    var objectKeys = Object.keys || function(obj){
        var keys = [];
        var key;
        for (key in obj) {
            if (hasOwn(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };





    //  Special selector syntax for faster selection of items using name, id, class, or tag
    //  x0('?foo').get()      -->  returns array of elements with [name="foo"] using faster 'getElementsByName' method
    //  x0('#:bar').get(0)    -->  returns element at index [0] with [id="bar"] using super-fast 'getElementById' method ('|' is needed for id and className selectors)
    //  x0('..baz').all()     -->  returns array of elements with [class="bar"] using super-fast 'getElementsByClassName' method ('|' is needed for id and className selectors)
    //  x0('~select').get()   -->  returns array of <select> elements using faster 'getElementsByTagName' method
    //  x0('~select').get(3)  -->  returns <select> element at index [3] using faster 'getElementsByTagName' method (optional '|' prefix separator can be used but is not required)
    //  document.getElementsByTagName('select')[3] --> same as above
    /**
     * Special selector syntax - shorthand for faster selection methods
     * @param {*} value
     * @param {Element|HTMLDocument|Boolean} [context]
     * @returns {X0}
     */
    function x0(value, context){
        return new X0(value, context);
    }





    function isDefined(it){
        return it !== undef;
    }
    x0.isDefined = isDefined;


    function isUndefined(it){
        return it === undef;
    }
    x0.isUndefined = isUndefined;


    function firstDefined(){
        var i      = -1;
        var argLen = arguments.length;
        var item;
        while (++i < argLen) {
            item = arguments[i];
            if (isDefined(item)) {
                return item;
            }
        }
        return undef;
    }
    x0.firstDefined = firstDefined;


    // utility for getting URL query string value
    function getQueryStringValue(param){
        var search = window.location.search;
        if (!param || !search) { return ''; }
        if (search.indexOf(param + '=') === -1) { return ''; }
        var val = search.split(param + '=')[1].split('&')[0].split('#')[0].replace(/\/*$/, '');
        return window.decodeURIComponent(val);
    }
    x0.getQueryStringValue = getQueryStringValue;
    x0.getParameterByName  = getQueryStringValue;
    x0.getParameterValue   = getQueryStringValue;
    x0.queryStringValue    = getQueryStringValue;
    x0.getQueryParam       = getQueryStringValue;
    x0.getParamValue       = getQueryStringValue;
    x0.getParam            = getQueryStringValue;




    var jsdebug = x0.jsdebug = firstDefined(
        window.jsdebug,
        x0.jsdebug,
        /true/i.test(getQueryStringValue('jsdebug') || getQueryStringValue('debug'))
    );





    //////////////////////////////////////////////////
    // UTILITIES
    //////////////////////////////////////////////////


    x0.hasOwn     = hasOwn;
    x0.isArray    = isArray;
    x0.objectKeys = objectKeys;


    function isString(it){
        return typeof it === 'string';
    }
    x0.isString = isString;


    function stringable(val){
        return /^(string|number|boolean)$/i.test(typeof val);
    }
    x0.stringable   = stringable;
    x0.isStringable = stringable;


    function isNumber(it){
        return (typeof it === 'number' && !isNaN(it));
    }
    x0.isNumber = isNumber;


    function isNumeric(it){
        return !isArray(it) && (it - parseFloat(it) + 1) >= 0;
    }
    x0.isNumeric = isNumeric;


    function isBoolean(it){
        return typeof it === 'boolean';
    }
    x0.isBoolean = isBoolean;


    function isTrue(it){
        return it === true;
    }
    x0.isTrue = isTrue;


    function isFalse(it){
        return it === false;
    }
    x0.isFalse = isFalse;


    function isNode(it){
        return it instanceof Node;
    }
    x0.isNode = isNode;


    function isElement(it){
        return it instanceof Element;
    }
    x0.isElement = isElement;


    function isFragment(it){
        return it instanceof DocumentFragment;
    }
    x0.isFragment = isFragment;


    function isNodeList(it){
        return it instanceof NodeList;
    }
    x0.isNodeList = isNodeList;


    function isHtmlCollection(it){
        return it instanceof HTMLCollection;
    }
    x0.isHtmlCollection = isHtmlCollection;
    x0.isHTMLCollection = isHtmlCollection;


    function isFunction(it){
        return typeof it === 'function';
    }
    x0.isFunction = isFunction;


    function isPlainObject(it){
        return Object.prototype.toString.call(it) === '[object Object]';
    }
    x0.isPlainObject = isPlainObject;


    function isObject(it){
        return isPlainObject(it) || isFunction(it);
    }
    x0.isObject = isObject;


    function getObject(obj){
        return isObject(obj) ? obj : {};
    }
    x0.getObject = getObject;


    function isEmptyObject(obj){
        var key;
        for (key in obj) {
            return false;
        }
        return true;
    }
    x0.isEmptyObject = isEmptyObject;


    function isEmptyArray(arr){
        return isArray(arr) && arr.length === 0;
    }
    x0.isEmptyArray = isEmptyArray;


    function isEmpty(x, args){
        if (isArray(x)) {
            return !x.length;
        }
        if (isPlainObject(x)) {
            return isEmptyObject(x);
        }
        if (isString(x)) {
            return x === '';
        }
        if (typeof x === 'boolean') {
            return false;
        }
        if (isNumeric(x)) {
            return false;
        }
        // does a function return an 'empty' value?
        if (isFunction(x)) {
            return isEmpty(x.apply(null, [].concat(args)));
        }
        return (x === null || isUndefined(x) || !isFunction(x));
    }
    x0.isEmpty = isEmpty;


    function inArray(arr, it){
        var i     = -1, len;
        var items = arr;
        var item  = it;
        // tolerate flipped arguments
        if (isArray(it)) {
            items = it;
            item  = arr;
        }
        len = items.length;
        if (!len) {
            return false;
        }
        while (++i < len) {
            if (items[i] === item) {
                return true;
            }
        }
        return false;
    }
    x0.inArray = inArray;


    // returns real boolean for boolean string
    // returns real number for numeric string
    // returns null and undefined for those strings
    // (or returns original value if none of those)
    // useful for pulling 'real' values from
    // a string used in [data-] attributes
    function realValue(val, bool){
        // only evaluate strings
        if (!isString(val)) return val;
        if (bool) {
            if (val === '0') {
                return false;
            }
            if (val === '1') {
                return true;
            }
        }
        if (isNumeric(val)) {
            return +val;
        }
        switch(val) {
            case 'true':
                return true;
            case 'false':
                return false;
            case 'undefined':
                return undef;
            case 'null':
                return null;
            default:
                return val;
        }
    }
    x0.realValue = realValue;


    function returnValue(value){
        return value;
    }
    x0.returnValue = returnValue;


    function firstObject(obj1, obj2, etc){
        var i      = -1;
        var argLen = arguments.length;
        var obj;
        while (++i < argLen) {
            obj = arguments[i];
            if (isObject(obj)) {
                return obj;
            }
        }
        return {};
    }
    x0.firstObject = firstObject;


    // lookup value for property at `path` in `obj` object
    function objectLookup(obj, path, prop){

        var val         = '';
        var delim       = '.';
        var brackets    = /[\]\[]/;
        var hasBrackets = false;
        var parts       = [];

        if (!path) {
            path = obj + '';
            obj  = window;
        }

        // TODO: what is this check for?
        // if (isString(path)) return path || '';

        obj = obj || window;

        path = ((path || '') + '').trim();

        // if 'path' STARTS WITH a colon, use ':' as the path delimiter
        if (path.charAt(0) === ':') {
            delim = ':';
        }
        // if 'path' contains brackets, use bracket notation
        else if (path.indexOf('[') > -1) {
            delim       = brackets;
            hasBrackets = true;
        }
        // otherwise we're probably using dot notation

        forEach(path.split(delim), function(part, i){
            // if using brackets, trim brackets and quotes
            if (hasBrackets) {
                part = part.replace(/^[\['"]|['"\]]$/g, '');
            }
            part = part.trim();
            // only push non-empty parts
            // this should filter items that
            // start or end with a delimiter
            if (part > '') parts.push(part);
        });

        forEach(parts, function(part, i){
            // start at the object root
            if (i === 0) {
                val = (obj[part] !== undef) ? obj[part] : '';
            }
            else {
                if (val === undef) return false;
                val = val[part];
            }
        });

        // optionally set a final property name to look for
        if (prop && val[prop] !== undef) {
            return val[prop];
        }
        else {
            return val;
        }
    }
    x0.objectLookup      = objectLookup;
    x0.lookupValue       = objectLookup;
    x0.lookupObjectValue = objectLookup;




    //////////////////////////////////////////////////
    // ITERATORS
    //////////////////////////////////////////////////


    // call [fn] for items in an array...
    // halt execution if fn() returns explicit false
    function forEach(arr, fn, context){
        if (jsdebug) console.log('forEach');
        var i   = -1;
        var len = arr.length;
        // if `arr` is defined but has no length,
        // wrap it in an array and set `len` to 1
        if (arr && !len) {
            arr = [arr];
            len = 1;
        }
        if (!len) {
            return [];
        }
        if (fn && isFunction(fn)) {
            while (++i < len) {
                // exit loop early if fn() returns false
                if (fn.call(context || this, arr[i], i, arr) === false) {
                    break;
                }
            }
        }
        return arr;
    }
    x0.forEach = forEach;


    // iterate an array-like object and return an
    // actual array with items transformed by [fn]
    function mapEach(arr, fn, context){
        var i   = -1;
        var len = arr ? arr.length : 0;
        // if `arr` is defined but has no length,
        // wrap it in an array and set `len` to 1
        if (arr && !len) {
            arr = [arr];
            len = 1;
        }
        if (!len) {
            return [];
        }
        var out  = new Array(len);
        var func = (fn && isFunction(fn)) ? fn : null;
        try {
            while (++i < len) {
                out[i] = func ?
                    func.call(context || this, arr[i], i, arr) :
                    arr[i];
            }
        }
        catch(e) {
            console.warn(e);
        }
        return out;
    }
    x0.map        = mapEach;
    x0.mapEach    = mapEach;
    x0.forEachMap = mapEach;


    // execute a function on each of an object's own properties
    // returns shallow copy of original object
    // iterates object keys for better performance
    function forOwn(obj, fn, context){
        var out = {};
        if (!isObject(obj)) {
            return out;
        }
        var keys = objectKeys(obj);
        var len  = keys.length;
        if (!len) {
            return {};
        }
        var i    = -1;
        var func = (fn && isFunction(fn)) ? fn : null;
        var key, val;
        try {
            while (++i < len) {
                key      = keys[i];
                val      = obj[key];
                out[key] = func ? func.call(context || this, key, val) : val;
            }
        }
        catch(e) {
            console.warn(e);
        }
        return out;
    }
    x0.forOwn = forOwn;


    // iterate an object's keys, returning the array of keys
    function forKeys(obj, fn, context){
        if (!isObject(obj)) {
            return [];
        }
        var keys = objectKeys(obj);
        var func = (fn && isFunction(fn)) ? fn : null;
        var self = this;
        func && forEach(keys, function(key, i){
            return func.call(context || self, key, i);
        });
        return keys;
    }
    x0.forKeys    = forKeys;
    x0.forOwnKeys = forOwn;


    // call `fn` on an object's keys and return the new array
    function mapKeys(obj, fn, context){
        if (!isObject(obj)) {
            return [];
        }
        var keys = objectKeys(obj);
        var func = (fn && isFunction(fn)) ? fn : null;
        var self = this;
        return func ? keys.map(function(key, i){
            return func.call(context || self, key, i);
        }) : keys;
    }
    x0.mapKeys = mapKeys;


    // iterate only an object's *values*
    function forValues(obj, fn, context){
        var out = {};
        if (!isObject(obj)) {
            return out;
        }
        var keys = objectKeys(obj);
        var len  = keys.length;
        var i    = -1;
        var func = (fn && isFunction(fn)) ? fn : null;
        var key, val;
        while (++i < len) {
            key      = keys[i];
            val      = obj[key];
            out[key] = func ? func.call(context || this, val, i) : val;
        }
        return out;
    }
    x0.forValues    = forValues;
    x0.forOwnValues = forValues;


    // iterate over an object's own enumerable properties
    function forOwnProperties(obj, fn, context){
        var out = {};
        if (!isObject(obj)) {
            return out;
        }
        var func = (fn && isFunction(fn)) ? fn : null;
        var key;
        for (key in obj) {
            if (hasOwn(obj, key)) {
                out[key] = func ? func.call(context || this, key, obj[key]) : obj[key];
            }
        }
        return out;
    }
    x0.forOwnProperties = forOwnProperties;


    // 'smart' iterator for arrays *or* objects
    function each(it, fn, context){
        if (!it || !isFunction(fn)) {
            return;
        }
        if (it.length) {
            return forEach.apply(context || this, arguments);
        }
        if (isObject(it)) {
            return forOwn.apply(context || this, arguments);
        }
        // do we want to handle properties and methods attached to Function objects?
        // if (isFunction(it)) {
        //     return forOwn.apply(this, arguments);
        // }
    }
    x0.each = each;



    //////////////////////////////////////////////////
    // TRANSFORMERS
    //////////////////////////////////////////////////


    // best effort to convert to useable string
    function toString(it, fn){
        var str = '';
        if (isFunction(fn)) {
            str = fn.call(it, it);
        }
        if (stringable(str)) {
            return str + '';
        }
        else {
            try {
                return JSON.stringify(str);
            }
            catch(e){
                jsdebug && console.warn(e);
            }
        }
        return str + '';
    }
    x0.toString = toString;


    // sort an array of objects using value of `prop`
    function sortObjects(objects, prop){
        return objects.sort(function(_a, _b){
            var a = _a[prop].toUpperCase();
            var b = _b[prop].toUpperCase();
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
    }
    x0.sortObjects = sortObjects;


    function numericSort(a, b){
        return (a * 1) - (b * 1);
    }
    x0.numericSort = numericSort;


    function toArray(arr, start){
        if (isArray(arr)) {
            return arr;
        }
        if (stringable(arr) || isObject(arr)) {
            return [arr];
        }
        var i   = (start || 0) - 1,
            len = arr.length || 0,
            out = new Array(len);
        // if `arr` is defined but has no length,
        // just wrap it in an array.
        if (isDefined(arr) && !len) {
            return [arr];
        }
        while (++i < len) {
            // remove undefined values?
            // newArray[i] = (arr[i] !== undef ? arr[i] : arr);
            out[i] = arr[i];
        }
        return out;
    }
    x0.toArray = toArray;


    // // convert a single non-string array-like item to an actual array
    // function toArrayX(arr){
    //     var i   = -1;
    //     var len = arr.length || 0;
    //     if (!arr || !len || (arr + '' === arr)) { return [].concat(arr || []); }
    //     var out = new Array(len);
    //     while (++i < len) {
    //         out[i] = arr[i];
    //     }
    //     return out;
    // }


    // convert multiple arguments to a single array
    function toArrayAll(){
        var i      = -1;
        var argLen = arguments.length;
        var out    = new Array(argLen);
        while (++i < argLen) {
            out[i] = arguments[i];
        }
        return out;
    }
    x0.toArrayAll = toArrayAll;


    // convert multiple arguments to a single *flattened* array
    function toFlatArray(){
        var i      = -1;
        var out    = [];
        var argLen = arguments.length;
        var arg;
        while (++i < argLen) {
            arg = arguments[i];
            if (arg.length && !isString(arg)) {
                arg = toFlatArray.apply(null, arg);
            }
            out = out.concat(arg);
        }
        return out;
    }
    x0.toFlatArray = toFlatArray;


    // break an array into a 2-D array of smaller 'chunks'
    function chunkArray(arr, len){
        var chunks = [],
            i      = 0,
            n      = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }
    x0.chunkArray = chunkArray;
    x0.chunk      = chunkArray;


    function objectAssign(target, obj, etc){
        if (typeof Object.assign !== 'function') {
            // Must be writable: true, enumerable: false, configurable: true
            Object.defineProperty(Object, 'assign', {
                value: function assign(target, varArgs){ // .length of function is 2
                    'use strict';
                    if (target == null) { // TypeError if undefined or null
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var to    = Object(target);
                    var index = -1;
                    var len   = arguments.length;
                    while (++index < len) {
                        var nextSource = arguments[index];
                        if (nextSource != null) { // Skip over if undefined or null
                            for (var nextKey in nextSource) {
                                // Avoid bugs when hasOwnProperty is shadowed
                                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                    to[nextKey] = nextSource[nextKey];
                                }
                            }
                        }
                    }
                    return to;
                },
                writable: true,
                configurable: true
            });
        }
        Object.assign.apply(Object, arguments);
        return target;
    }
    x0.objectAssign = objectAssign;


    // EXTENDS *ONLY* PLAIN OBJECTS AND FUNCTIONS
    function extend(/* deep, dest, obj1, obj2, etc */){
        var src, copy, key, obj, clone;
        var i      = 1;
        var argLen = arguments.length;
        var deep   = false;
        var dest   = arguments[0] || {};
        // pass true for first argument to do a deep copy
        if (isBoolean(dest)) {
            deep = dest;
            dest = arguments[i] || {};
            i++;
        }
        // copy dest if only one object is passed
        if (i === argLen) {
            dest = {};
            i--;
        }
        // make sure dest is an object
        dest = getObject(dest);
        while (i < argLen) {
            // iterate arguments
            // assign 'obj' var AND check for non-null
            if ((obj = arguments[i]) != null) {
                for (key in obj) {
                    src  = dest[key];
                    copy = obj[key];
                    // prevent infinite loop
                    if (dest === copy) {
                        continue;
                    }
                    if (deep && copy && isObject(copy)) {
                        clone     = getObject(src);
                        // always clone
                        dest[key] = extend(deep, clone, copy);
                    }
                    else if (copy !== undef) {
                        dest[key] = copy;
                    }
                }
            }
            i++;
        }
        return dest;
    }
    x0.extend = extend;


    // general cloning function that should handle
    // deep cloning of arrays, objects, and DOM nodes
    function clone(it, deep){
        if (isArray(it)) {
            return [].concat(it.map(function(item){
                if (isArray(item)) {
                    return clone(item);
                }
                else if (isPlainObject(item)) {
                    return extend(firstDefined(deep, true), {}, item);
                }
                else {
                    return item;
                }
            }));
        }
        if (isPlainObject(it)) {
            return extend(true, {}, it);
        }
        if (isNode(it)) {
            return it.cloneNode(deep || false);
        }
        return it;
    }
    x0.clone = clone;


    function lowercase(str){
        return (str + '').toLowerCase();
    }
    x0.lowercase = lowercase;


    function uppercase(str){
        return (str + '').toUpperCase();
    }
    x0.uppercase = uppercase;


    function capitalize(str){
        str = str + '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    x0.capitalize = capitalize;


    function sentenceCase(str){
        return capitalize(str);
    }
    x0.sentenceCase = sentenceCase;


    function titleCase(str){
        return str.split(/\s+/).map(function(word){
            return capitalize(word);
        }).join(' ');
    }
    x0.titleCase = titleCase;


    function trim(str, toTrim){
        if (!toTrim) {
            return (str || '').trim();
        }
        toTrim = firstDefined(toTrim, '\\s+');
        return str.replace((new RegExp('^' + toTrim + '|' + toTrim + '$', 'g')), '');
    }
    x0.trim = trim;


    function truncateText(text, len, filler){
        len = len || 30; // default length is 30 chars
        if (text.length <= len) {
            return text;
        }
        else {
            return text.substr(0, len) + (filler || '&hellip;');
        }
    }
    x0.truncateText = truncateText;
    x0.truncate     = truncateText;


    function toDashed(str){
        str = isDefined(str) ? str + '' : '';
        return str.replace(/[A-Z]/g, function(u){
            return '-' + u;
        }).replace(/[A-Z]-/g, function(c){
            return c.replace(/-$/, '');
        }).toLowerCase().replace(/[\W_-]+/g, '-').replace(/^-*|-*$/g, '');
    }
    x0.toDashed = toDashed;


    function toUnderscore(str){
        return toDashed(str).replace(/-+/g, '_');
    }
    x0.toUnderscore = toUnderscore;


    function toCamelCase(str){
        // 'sanitize' by running str through toDashed()
        return toDashed(str).replace(/-./g, function(u){
            return u.substr(1).toUpperCase();
        });
    }
    x0.toCamelCase = toCamelCase;
    x0.camelCase   = toCamelCase;


    function padNumber(num, size, fill){
        // only whole numbers
        if (parseInt(num, 10) !== +num) { return num + ''; }
        num = num + ''; // make sure 'num' is a string
        // make sure 'size' is a whole number
        // defaults to 2 digits
        size = isDefined(size) ? parseInt(size, 10) : 2;
        fill = fill || '0'; // default fill character is '0'
        return (num.length >= size) ? num : new Array(size - num.length + 1).join(fill) + num;
    }
    x0.padNumber = padNumber;


    function zeroPad(num, size){
        return padNumber(num, size, '0');
    }
    x0.zeroPad = zeroPad;


    function guidPart(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    //
    function guid(){
        return '' +
            guidPart() + guidPart() + '-' +
            guidPart() + '-' +
            guidPart() + '-' +
            guidPart() + '-' +
            guidPart() + guidPart() + guidPart() +
            '';
    }
    x0.guid = guid;


    function uuid(){
        var output = '', i = -1, random;
        while (++i < 32) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                output += '-';
            }
            output += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return output;
    }
    x0.uuid = uuid;


    var uids = 0;


    // shorter unique ID with optional custom prefix and inserted counter
    function uid(prefix){
        var pre = (prefix || 'x0id') + '';
        return pre + (uids += 1) + (Math.random() + 1).toString(36).substr(2, 8);
    }
    x0.uid = uid;


    function randomString(prefix, length){
        var pre    = prefix || '';
        var len    = length || 8;
        var output = pre + (Math.random() + 1).toString(36).substr(2, 8);
        while (output.length < len) {
            output += randomString();
        }
        return output.substr(0, len);
    }
    x0.randomString = randomString;


    function randomFromArray(arr){
        return arr[Math.floor(Math.random() * (arr.length))];
    }
    x0.randomFromArray = randomFromArray;


    // basic indentation formatting only
    function formatJSON(json, indent){
        return JSON.stringify(json, null, indent || 4);
    }
    x0.formatJSON = formatJSON;


    // replace values wrapped in {{...}} or ((...)) to:
    function stringReplace(str){

        // {{ foo.bar.baz }} // object lookup
        var LOOKUP_REGEX = /{{(.*?)}}/g;

        // (( 1+2+3 )) // js eval
        var EVAL_REGEX = /\(\((.*?)\)\)/g;

        return (str + '').replace(LOOKUP_REGEX, function(part){
            var pt = (part + '').trim()
                                .replace(/^{{\s*|\s*}}$/g, '');
            return firstDefined(objectLookup(pt), part);
        }).replace(EVAL_REGEX, function(part){
            var pt = (part + '').trim()
                                .replace(/^\(\(\s*|\s*\)\)$/g, '');
            if (jsdebug) console.log(part);
            if (jsdebug) console.log(pt);
            try {
                return firstDefined(eval(pt), part);
            }
            catch(e) {
                if (jsdebug) console.log(e);
                return part;
            }
        });
    }
    x0.stringReplace = stringReplace;



    //////////////////////////////////////////////////
    // DOM MANIPULATION
    //////////////////////////////////////////////////


    x0.$0 = {};

    // map of 'special' selector prefixes to the associated selection method
    var METHODMAP = {

        '# ': 'byId',
        '#:': 'byId',
        '#=': 'byId',
        '#|': 'byId',
        ':#': 'byId',
        // '|#': 'byId',

        '. ': 'byClass',
        '..': 'byClass',
        '.:': 'byClass',
        ':.': 'byClass',
        '.|': 'byClass',
        // '|.': 'byClass',

        '?': 'byName',
        '? ': 'byName',
        '?.': 'byName',
        '?:': 'byName',
        '?|': 'byName',
        // '|?': 'byName',

        '~': 'byTag',
        '~ ': 'byTag',
        '~:': 'byTag',
        '~|': 'byTag',
        // '|~': 'byTag',

        '<': 'byTag',
        '< ': 'byTag',
        '<:': 'byTag',
        '<|': 'byTag',
        // '|>': 'byTag',
        '<>': 'byTag',

        '@': 'byAttr',
        '@ ': 'byAttr',
        '@:': 'byAttr',
        '@|': 'byAttr',

        '=': 'byValue',
        '= ': 'byValue',
        '==': 'byValue',
        '=:': 'byValue',
        '=|': 'byValue',
        // '|=': 'byValue',

        '^': 'query',
        '^ ': 'query',
        '^*': 'query',
        '^:': 'query',
        '^|': 'query',

        '/': 'query',
        '/ ': 'query',
        '/:': 'query',
        '/|': 'query',
        // '|/': 'query',
        '|': 'query',
        '| ': 'query',
        // '|*': 'query',
        // '*|': 'query',

        '$': 'queryLast',
        '$ ': 'queryLast',
        '$:': 'queryLast',
        '$|': 'queryLast',
        // ':$': 'queryLast',
        // '|$': 'queryLast',
        // '*$': 'queryLast',

        '**': 'queryAll',
        '||': 'queryAll',
        '//': 'queryAll',

        '++': 'newElement',
        '+ ': 'newElement',
        '+': 'newElement',
        // '+|': 'newElement',
        // '|+': 'newElement',
        // '+:': 'newElement',

        o_o: null

    };


    // whitespace is allowed after the selector
    // type prefix (before the selector string)

    var SELECTOR_EXAMPLES = {

        id: [
            '# ur-id',
            '#:ur-id',
            '#| ur-id',
            null
        ],

        className: [
            '. ur-class',
            '..ur-class',
            '.:ur-class',
            '.| ur-class',
            null
        ],

        name: [
            '?ur-name',
            '? ur-name',
            '?:ur-name',
            '?| ur-name',
            null
        ],

        tagName: [
            '~ p',
            '~p',
            '~|p',
            null
        ],

        attribute: [
            '@ title="bogus"',
            '@title="bogus"',
            '@:title="bogus"',
            null
        ],

        byValue: [  // get items with specified CURRENT value
            '==bob',
            '=fred',
            '= george',
            '=:bill',
            null
        ],

        newElement: [
            '++div#foo.bar', // works when x0.spawnElement() is present
            '+ p',
            '++ p',
            '+h2',
            null
        ],

        query: [  //return *first* matching element
            '/ div.foo',
            '/div.foo',
            '| p.baz',
            null
        ],

        queryAll: [  // return *all* matching elements
            '// div.foo',
            '//div.bar',
            '**p.baz',
            null
        ],

        o_o: null

    };

    function resolveContext(context){
        if (isString(context)) {
            return x0(context).get(0);
        }
        if (isElement(context)) {
            return context;
        }
        return document;
    }

    // determine selection method and selector string
    function parseSelector(str){
        var selector = str;
        var type     = selector.substr(0, 2);
        if (METHODMAP[type]) {
            selector = selector.substr(2);
        }
        else {
            type = selector.charAt(0);
            if (METHODMAP[type]) {
                selector = selector.substr(1);
            }
            else {
                type = '**';
            }
        }
        return {
            methodName: METHODMAP[type],
            selector: selector.trim()
        };
    }

    function appendSpawn(spawned, items, spawnFn){
        forEach([].concat(items), function(item){
            if (stringable(item)) {
                spawned.innerHTML += (item + '');
            }
            else if (isArray(item)) {
                spawned.appendChild(spawnFn.apply(spawned, item));
            }
        });
        return spawned;
    }

    function simpleSpawn(tag, opts, contents){

        var spawned = document.createElement(tag);

        if (opts) {
            if (isPlainObject(opts)) {
                forOwn(opts, function(prop, val){
                    try {
                        spawned[prop] = val;
                    }
                    catch(e) {
                        console.warn(e);
                        try {
                            spawned.setAttribute(prop, val);
                        }
                        catch(ee) {
                            console.warn(ee);
                        }
                    }
                });
            }
            else if (isArray(opts)) {
                appendSpawn(spawned, opts, simpleSpawn);
            }
            else if (stringable(opts)) {
                spawned.innerHTML += (opts + '');
            }
        }

        if (contents) {
            if (stringable(contents)) {
                spawned.innerHTML += (contents + '');
            }
            else if (isArray(contents)) {
                appendSpawn(spawned, contents, simpleSpawn);
            }
        }

        return spawned;

    }

    function newElement(tag, opts, contents){
        var spawned = (x0.spawnElement || simpleSpawn).apply(null, arguments);
        // spawned.on  = spawned.addEventListener;
        // spawned.off = spawned.removeEventListener;
        return new X0({
            selected: [spawned],
            spawned: spawned
        });
    }

    /**
     * Return collection of selected elements as a real array.
     * @param {String|Array} selector
     * @param {Document|Element|String} [context]
     * @param {String} [method]
     * @returns {*[]}
     */
    function getElements(selector, context, method){
        if (isElement(selector) || isArray(selector)) {
            return [].concat(selector);
        }
        var parsed   = parseSelector(selector);
        var parent   = resolveContext(context);
        // get the things
        var selected = parent[method || parsed.methodName](selector);
        // return selected elements as an array
        return toArray(selected);
    }
    x0.getElements = getElements;


    function getElement(selector, context, idx){
        var selected = getElements(selector, context, 'querySelectorAll');
        var index    = (+idx < 0) ? (selected.length - (-idx)) : +(idx || 0);
        return selected[index];
    }
    x0.getElement = getElement;


    // function returnSelected(selected, asArray){
    //     return asArray ? toArray(selected) : selected;
    // }

    // elements that can have a 'value' property or attribute
    var HAS_VALUE = 'button, data, input, meter, output, param, progress, select, textarea';

    var METHODS = {
        byId: function byId(id, context){
            var selector, method;
            if (context && context !== document) {
                selector = '#' + id.trim();
                method   = 'querySelector';
            }
            else {
                selector = id;
                method   = 'getElementById';
            }
            return getElements(selector, context, method);
        },
        byClass: function byClass(className, context){
            return getElements(className, context, 'getElementsByClassName');
        },
        byName: function byName(name, context){
            return getElements(name, context, 'getElementsByName');
        },
        byTag: function byTag(tag, context){
            return getElements(tag, context, 'getElementsByTagName');
        },
        byAttr: function byAttr(attr, context){
            return getElements('[' + attr + ']', context, 'querySelectorAll');
        },
        byValue: function byValue(value, context){
            return getElements(HAS_VALUE, context, 'querySelectorAll').filter(function(el){
                // special handling of this selector to match CURRENT value,
                // not the value when loaded
                return (el.value + '') === (value + '');
            });
        },
        byData: function byData(keyValue, context){
            var key      = keyValue.split('=')[0];
            var val      = keyValue.split('=')[1];
            var selector = '[data-' + toDashed(key) + (val ? '=' + val : '') + ']';
            return getElements(selector, context, 'querySelectorAll');
        },
        query: function query(selector, context){
            return getElements(selector, context, 'querySelector')[0] || null;
        },
        queryLast: function queryLast(selector, context){
            var selected  = getElements(selector, context, 'querySelectorAll');
            var lastIndex = selected.length ? (selected.length - 1) : 0;
            return selected[lastIndex] || null;
        },
        queryAll: function queryAll(selector, context){
            return getElements(selector, context, 'querySelectorAll');
        },
        newElement: newElement
    };

    // aliases
    METHODS.first = 'query';
    METHODS.last  = 'queryLast';
    METHODS.all   = 'queryAll';

    METHODS.querySelector = 'query';
    METHODS.querySelectorAll = 'queryAll';

    // add element selection METHODS to x0 object
    forOwn(METHODS, function(method, i){
        x0[method] = METHODS[method];
        // don't create get* methods for 'query*' methods
        if (!/^query/i.test(method)) {
            x0['get' + (method.charAt(0).toUpperCase() + method.slice(1))] = METHODS[method];
        }
    });
    // ^^^ added above ^^^
    // x0.byId()      || x0.getById()
    // x0.byClass()   || x0.getByClass()
    // x0.byName()    || x0.getByName()
    // x0.byValue()   || x0.getByValue()
    // x0.byTag()     || x0.getByTag()
    // x0.byAttr()    || x0.getByAttr()
    // x0.query()     || x0.getFirst()   || x0.first()
    // x0.queryLast() || x0.getLast()    || x0.last()
    // x0.queryAll()  || x0.getAll()     || x0.all()


    /**
     * Special selector syntax - shorthand for faster selection methods
     * @param {string|Object|HTMLElement|X0} selector
     * @param {HTMLElement|HTMLDocument|Document|string} [context]
     * @constructor X0
     */
    function X0(selector, context){

        var selected = null;
        var type = '**';

        // set some defaults
        extend(this, {
            // selected: selected,
            spawned: null,
            selector: 'html > *',
            context: document,
            prefix: type,
            methodName: 'queryAll',
            method: METHODS['queryAll']
        }, this);

        if (isElement(selector) || isArray(selector)) {
            selected = [].concat(selector);
        }
        else if (isPlainObject(selector) || selector instanceof X0) {
            extend(this, selector);
        }
        else {

            type = selector.substr(0, 2);

            // // x0('..foo[]') returns an array of .foo elements
            // if (selector.substr(-2) === '[]') {
            //     selector = selector.slice(0, -2);
            //     asArray  = true;
            // }

            if (METHODMAP[type]) {
                selector = selector.substr(2);
            }
            else {
                type = selector.charAt(0);
                if (METHODMAP[type]) {
                    selector = selector.substr(1);
                }
                else {
                    type = '**';
                }
            }

            this.selector = selector.trim();
            this.context  = context || document;

            this.prefix     = type;
            this.methodName = METHODMAP[type];
            this.method     = METHODS[this.methodName];

        }

        selected = selected || this.method(this.selector, this.context);

        if (selected instanceof X0) {
            extend(this, selected)
        }

        this.selected = this.selected || selected;

        // this.selectedArray = isArray(this.selected) ? this.selected : [];
        this.selectedArray = [];

        if (this.selected.length) {
            this.selectedArray = this.selected = toArray(this.selected);
        }

        // this.selected.selector = this.selector;
        // this.selected.context = this.context;
        // this.selected.x0 = this;

    }

    X0.fn = X0.prototype;

    X0.fn.toArray = function _toArray(){
        this.selectedArray = toArray(this.selected);
        return this.selectedArray;
    };

    // execute [callback] with the selected elements as a real array
    X0.fn.asArray = function _asArray(callback){
        // if this.selectedArray is empty, convert to an array
        !this.selectedArray.length && this.toArray();
        if (callback && isFunction(callback)) {
            return callback.call(this, this.selectedArray);
        }
        return this.selectedArray;
    };

    // return all selected elements as a 'real' array
    // this will NOT update the `selectedArray` if already defined
    X0.fn.all = function _all(update){
        // the `toArray` method updates the `selectedArray` value
        if (update === true) {
            this.toArray();
        }
        else {
            !this.selectedArray.length && this.toArray();
        }
        return this.selectedArray;
    };

    // x0('.|things').get([]);  -->  returns array of elements with 'things' class
    // x0('.:things').get(1);   -->  returns element at index `1` with 'things' class
    // x0('..things').get();    -->  returns selected elements with 'things' class
    X0.fn.get = function _get(arg){
        if (isUndefined(arg)) {
            return this.selected;
        }
        if (isNumber(arg)) {
            return this.all()[arg];
        }
        if (isArray(arg)) {
            return [].concat(arg, this.all());
        }
        if (isFunction(arg)) {
            return arg.apply(this, this.selected);
        }
        return this.selected;
    };

    X0.fn.each = function _each(callback){
        forEach(this.all(), function(item, i){
            callback.call(this, item, i);
        }, this);
        return this;
    };

    X0.fn.map = function _map(callback){
        return this.all().map(function(item, i){
            return callback.call(item, item, i);
        });
    };

    X0.fn.filter = function _filter(callback){
        return this.all().filter(function(item, i){
            return callback.call(item, item, i);
        });
    };

    X0.fn.exe = function _exe(callback){
        callback.call(this, this.all(true));
        return this;
    };

    X0.fn.html = function _html(str){
        // if `str` is omitted, return an array of the
        // innerHTML for each selected element
        if (isUndefined(str)) {
            return this.map(function(el){
                return el.innerHTML;
            });
        }
        var useFn = isFunction(str);
        this.each(function(el){
            el.innerHTML = useFn ? str.call(this) : str || '';
        });
        return this;
    };

    X0.fn.text = function _text(str){
        // if `str` is omitted, return an array of the
        // textContent for each selected element
        if (isUndefined(str)) {
            return this.map(function(el){
                return el.textContent;
            });
        }
        var useFn = isFunction(str);
        this.each(function(el){
            el.textContent = useFn ? str.call(this) : str || '';
        });
        return this;
    };

    X0.fn.hasClass = function _hasClass(cls){
        return this.asArray(function(arr){
            return arr[0].classList.contains(cls);
        });
    };

    X0.fn.toggleClass = function _toggleClass(className, method){
        this.each(function(element, i){
            var classes = [].concat(className).join(' ').split(/\s+/);
            forEach(classes, function(cls, i){
                if (method) {
                    element.classList[method](cls);
                }
                else {
                    try {
                        element.classList.toggle(cls);
                    }
                    catch(e) {
                        console.warn(e);
                        if (element.classList.contains(cls)) {
                            element.classList.remove(cls);
                        }
                        else {
                            element.classList.add(cls);
                        }
                    }
                }
            });
        });
        return this;
    };

    // add multiple classes with an array or space-separated list
    X0.fn.addClass = function _addClass(className){
        // this.each(function(element, i){
        //     var classes = [].concat(className).join(' ').split(/\s+/);
        //     forEach(classes, function(cls, i){
        //         element.classList.add(cls);
        //     });
        // });
        this.toggleClass(className, 'add');
        return this;
    };

    X0.fn.removeClass = function _removeClass(className){
        // this.each(function(element, i){
        //     var classes = [].concat(className).join(' ').split(/\s+/);
        //     forEach(classes, function(cls, i){
        //         element.classList.remove(cls);
        //     });
        // });
        this.toggleClass(className, 'remove');
        return this;
    };

    X0.fn.attr = function _attr(name, value){
        var attrMap = {};
        var selectedElement = this.get(0);
        // if no arguments are passed, return a map
        // of attribute names (not properties) with their values
        if (!arguments.length) {
            forEach(selectedElement.getAttributeNames(), function(attrName, i){
                var attrValue = selectedElement.getAttribute(attrName);
                // // get the *current* value if a value attribute is present -- DO WE WANT TO DO THIS?
                // if (/^value$/i.test(attrName)) {
                //     attrMap[attrName] = selectedElement.value || attrValue;
                // }
                attrMap[attrName] = attrValue;
            });
            return attrMap;
        }
        else if (arguments.length === 1) {
            if (isPlainObject(name)) {
                forOwn(name, function(attrName, attrValue){
                    this.each(function(el, i){
                        el.setAttribute(attrName, attrValue)
                    })
                }, this);
                return this;
            }
            return selectedElement.getAttribute(name);
        }
        else {
            this.each(function(el){
                el.setAttribute(name, value);
            });
        }

        return this;

    };

    X0.fn.prop = function _prop(prop, value){

        var propMap = {};
        var selectedElement = this.get(0);

        // need at least one argument
        if (!arguments.length) {
            return this;
        }

        if (arguments.length === 1) {

            // pass an object as the only argument
            // to set multiple properties at once
            if (isPlainObject(prop)) {
                forOwn(prop, function(name, val){
                    try {
                        selectedElement[name] = val
                    }
                    catch(e){
                        jsdebug && console.warn(e);
                    }
                });
                return this;
            }

            // pass an array as the only argument
            // to return a map of only those properties
            if (isArray(prop)) {
                forEach(prop, function(name, i){
                    propMap[name] = selectedElement[name];
                });
                return propMap;
            }

            // otherwise return the value for the specified property
            return selectedElement[prop];
        }

        // if there are two arguments, set the value to the specified property
        try {
            selectedElement[prop] = value;
        }
        catch(e){
            jsdebug && console.warn(e)
        }

        return this;

    };

    X0.fn.appendHTML = function _appendHTML(html){
        this.each(function(el, i){
            el.innerHTML += html;
        });
        return this;
    };
    X0.fn.appendHtml = X0.fn.appendHTML;

    X0.fn.append = function _append(it){
        if (stringable(it)) {
            this.appendHTML(it);
        }
        else if (isNode(it)) {
            this.get(0).appendChild(it);
        }
        else if (isArray(it)) {
            forEach(it, function(x, i){
                _append.call(this, x);
            }, this);
        }
    };

    X0.fn.appendTo = function _appendTo(parent, clone){
        var context = resolveContext(parent);
        this.each(function(element, i){
            try {
                context.appendChild(element);
            }
            catch(e) {
                console.warn(e);
            }
        });
        return this;
    };

    X0.fn.on = function _on(event, fn){
        this.each(function(element, i){
            try {
                element.addEventListener(event, fn)
            }
            catch(e){
                jsdebug && console.warn(e);
            }
        });
        return this;
    };

    // function recreateNode(el, withChildren) {
    //     if (withChildren) {
    //         el.parentNode.replaceChild(el.cloneNode(true), el);
    //     }
    //     else {
    //         var newEl = el.cloneNode(false);
    //         while (el.hasChildNodes()) {
    //             newEl.appendChild(el.firstChild);
    //         }
    //         el.parentNode.replaceChild(newEl, el);
    //     }
    // }

    X0.fn.off = function _off(event, fn) {
        this.each(function(el, i){
            var cloned;
            try {
                // ham-fisted way of removing all event listeners
                if (!event) {
                    cloned = el.cloneNode(false);
                    while (el.hasChildNodes()) {
                        cloned.appendChild(el.firstChild)
                    }
                    el.parentNode.replaceChild(cloned, el);
                }
                else {
                    el.removeEventListener(event, fn);
                }
            }
            catch(e){
                jsdebug && console.warn(e);
            }
        })
    };


    // just use ['querySelectorAll'] and return an array of elements
    function x00(selector, context){
        var collection = [];
        if (isString(context)) {
            context = document.querySelectorAll(context);
        }
        var parents = toArray(context || [document]);
        forEach(parents, function(parent){
            collection = collection.concat(toArray(parent.querySelectorAll(selector) || []));
        });
        return collection.filter(function(item){ return item; });
    }
    window.x00 = x00;


    // lightweight selector without all the prototype method baggage...
    // ...simply returns an array of elements, supporting the special selector syntax
    function x$(selector, context){

        var type = selector.substr(0, 2);

        if (METHODMAP[type]) {
            selector = selector.substr(2);
        }
        else {
            type = selector.charAt(0);
            if (METHODMAP[type]) {
                selector = selector.substr(1);
            }
            else {
                type = '**';
            }
        }

        selector = selector.trim();

        // if no context argument is provided,
        // use document and return the selected element(s)
        if (!context) {
            return METHODS[METHODMAP[type]](selector, document);
        }

        return mapEach([].concat(context), function(parent, i){

            parent = (
                isString(parent || null) ?
                    x$(parent, document)[0] :
                    parent
            );

            return METHODS[METHODMAP[type]](selector, parent || document);

        });

    }

    x$.loaded = true;

    x0.x$     = x$;
    window.x$ = x$;

    x0.loaded = true;

    return (window.x0 = x0);

}));
