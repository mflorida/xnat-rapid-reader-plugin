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

    var undef;

    // most basic check for presence of x0.js
    if (window.x0 === undef) {
        console.error('The required "x0.js" file is missing or not loaded.');
        return;
    }

    var x0 = window.x0;



    /**
     * Return an array of attributes to add to an element
     * @param {Object|Array|string} attrs - attributes to process
     * @param {Object} [defaults] - optional default attributes with values
     * @returns {*}
     */
    function processAttrs(attrs, defaults){

        var output = {
            attrs: {}
        };

        // split attributes if passed as a string
        // (we could just pass it through, but need to ensure we have defaults)
        if (x0.isString(attrs)) {
            attrs = attrs.split(/\s+/);
        }

        // create object if passed an array or string
        if (x0.isArray(attrs)) {
            x0.forEach(attrs, function(attr, i){
                var parts          = attr.split('=');
                var name           = parts[0];
                var val            = parts[1] || ('!!' + name);
                output.attrs[name] = val;
            });
        }

        var boolRegex = /^!!|<bool.*$/;

        defaults = defaults || {};

        // this check shouldn't be necessary, since the `attrs` argument
        // should have been converted to an object by this point
        if (x0.isPlainObject(attrs)) {
            x0.forOwn(attrs, function(attr, val){

                // prepend '!!' (`!!attrname`), or append '<bool>' (`attrname<bool>`) to the
                // attribute name to indicate boolean attribute that does not require a value
                // in the element a truthy or falsey value for the attribute will determine
                // whether or not it's added to the element
                // '!!ur-attr': testForCondition()  <-- adds `ur-attr` depending on result of function
                // 'ur-attr': '!!ur-attr'           <-- adds `ur-attr` without a value
                // 'ur-attr<bool>': !!maybeTrue     <-- adds `ur-attr` based on boolean evaluation
                if (boolRegex.test(attr) || boolRegex.test(val)) {

                    // boolean attributes don't require a value...
                    // ...their presence implies `true`
                    attr = attr.replace(boolRegex, '');

                    // this checks for a truthy/falsey value and sets
                    // the visibility of the attribute accordingly
                    if (!!val || attr === val.replace(boolRegex, '')) {
                        // but we can programatically determine whether or not the attribute is added
                        val = ('!!' + attr);
                    }
                    else {
                        attr = null;
                    }

                }

                // if attr is null, don't add it to the attributes
                attr && (output.attrs[attr] = val);

            });
        }
        else {
            output.attrs = {};
        }

        // apply any defaults that may not be set
        x0.forOwn(defaults, function(attr, defaultVal){
            output.attrs[attr] = x0.firstDefined(output.attrs[attr], defaultVal);
        });

        // return array of attribute strings
        // need to do [].join(' ') before inserting into element
        return x0.objectKeys(output.attrs).map(function(name){
            var val = output.attrs[name];
            if (val === ('!!' + name)) {
                return name;
            }
            else {
                return name + '="' + val + '"';
            }
        });

    }



    /**
     * Spawn an XML string using input parameters
     * Simple and fast but only generates XML string, not document
     * @param {String} tag - tag name for element
     * @param {Object|Array|String} [attrs] - element attributes
     * @param {String|Array} [content] - string or array of strings, arrays, or elements for child elements
     * @returns {String} HTML string
     */
    function spawnXML(tag, attrs, content){

        // tolerate passing an array as the only argument
        // (useful for building up an element tree before spawning)
        // spawnXML(['ns:foo', { name: 'bogus' }, 'Totally bogus'])
        if (arguments.length === 1 && x0.isArray(tag)) {
            // return spawnXML.apply(this, tag);
            content = tag[2] || [];
            attrs   = tag[1] || null;
            tag     = tag[0];
        }

        tag = tag || 'element';

        // make sure `attrs` is an object with at least one property
        attrs = (x0.isPlainObject(attrs) && x0.objectKeys(attrs).length) ? attrs : null;

        // `content` can be a function but must return a valid appendable value (string, element, spawn args)
        content = (x0.isFunction(content)) ? content.call(this) : content || [];

        var output   = {};
        output.inner = '';
        output.attrs = [];

        var isVoid = !content || !content.length;

        if (isVoid) {
            output.open = '<' + tag;
            // HTML5 will tolerate void elements that close with '/>' 
            // which is also compatible with XHTML and XML
            output.close = '/>';
        }
        else {
            output.open  = '<' + tag;
            output.inner = '>';
            output.inner += [].concat(content).map(function(child){
                // handle nested arrays as child elements
                if (x0.isArray(child)) {
                    return spawnXML.apply(this, child);
                }
                else if (x0.isElement(child)) {
                    return child.outerHTML;
                }
                else if (x0.isNode(child)) {
                    return (function(){
                        var tmp = document.createElement('tmp');
                        tmp.appendChild(child.cloneNode(true));
                        return tmp.innerHTML;
                    })();
                }
                else {
                    return child + '';
                }
            }).join('');
            output.close = '</' + tag + '>';
        }

        // process the attributes;
        if (attrs) {
            output.attrs = processAttrs(attrs);
        }

        var XML = '' +
            output.open +
            (output.attrs.length ? (' ' + output.attrs.join(' ').trim()): '') +
            (output.inner ? output.inner.trim() : '') +
            output.close;

        console.log(XML);

        return XML;

    }

    x0.spawnXML = spawnXML;




    /**
     * Spawn a complete XML document string with `<?xml ... ?>` header
     * @param {Object|Array|string} headerAttr - attributes for header
     * @param {Array|string} rootElement - root document element
     */
    function spawnXMLDocument(headerAttr, rootElement){

        var header = '' +
            '<?xml ' + processAttrs(headerAttr, {
                version: '1.0',
                encoding: 'UTF-8'
            }).join(' ') +
            '?>' +
            '';

        var root = (
            x0.isArray(rootElement) ?
                spawnXML.apply(this, rootElement) :
                rootElement
        );

        return [
            header,
            root
        ].join('\n');

    }

    x0.spawnXMLDocument = spawnXMLDocument;
    x0.spawnXMLDoc      = spawnXMLDocument;


}));

