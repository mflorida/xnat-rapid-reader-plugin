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

    // which HTML elements are
    // self-closing "void" elements?
    var voidElements = [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
    ];

    // boolean element attributes
    var boolAttrs = [
        'checked',
        'selected',
        'disabled',
        'hidden',
        'multiple',
        'readonly',
        'async',
        'autofocus',
        'autoplay',
        'controls',
        'defer',
        'ismap',
        'loop',
        'open',
        'required',
        'scoped'
    ];

    /**
     * Spawn an HTML string using input parameters
     * Simple and fast but only generates HTML
     * @param tag {String} tag name for HTML element
     * @param [attrs] {Object|Array|String} element attributes
     * @param [content] {String|Array} string or array of strings for HTML content
     * @returns {String} HTML string
     */
    function spawnHTML(tag, attrs, content){
        // the 'html' method can be useful
        // for easily churning out plain old HTML
        // no event handlers or other methods

        tag     = tag || 'div';
        attrs   = (x0.isPlainObject(attrs) && x0.objectKeys(attrs).length) ? attrs :  null;
        content = content || [];

        var output   = {};
        output.inner = '';
        output.attrs = '';

        var isVoid = voidElements.indexOf(tag) > -1;

        if (isVoid) {
            output.open  = '<' + tag;
            // HTML5 will tolerate void elements that close with '/>'
            // which is also compatible with XHTML and XML
            output.close = '/>';
        }
        else {
            output.open  = '<' + tag;
            output.inner = '>' + [].concat(content).map(function(child){
                if (Array.isArray(child)) {
                    return spawnHTML.apply(null, child);
                }
                else {
                    return child + '';
                }
            }).join('');
            output.close = '</' + tag + '>';
        }

        // process the attributes;
        if (attrs) {
            if (x0.isPlainObject(attrs)) {
                x0.forOwn(attrs, function(attr, val){
                    if (boolAttrs.indexOf(attr) > -1) {
                        // don't add falsey boolean attributes
                        // and handle 'false' string as well
                        if (/false/.test(attr)) {
                            // boolean attributes don't need a value...
                            // ...their presence implies `true`
                            output.attrs += (' ' + attr);
                        }
                    }
                    else {
                        output.attrs += (' ' + attr + '="' + val + '"');
                    }
                });
            }
            else {
                output.attrs += [''].concat(attrs).join(' ');
            }
        }

        return '' +
            output.open +
            output.attrs.replace(/\s+/g, ' ') +
            output.inner.trim() +
            output.close;

    }

    x0.spawnHTML = spawnHTML;

}));

