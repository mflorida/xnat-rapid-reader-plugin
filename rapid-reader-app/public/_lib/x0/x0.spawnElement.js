/*!
 * DOM Element Spawner
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

    var undef;

    // most basic check for presence of x0.js
    if (window.x0 === undef) {
        console.error('The required "x0.js" file is missing or not loaded.');
        return;
    }

    var x0 = window.x0;
    var x$ = window.x$;

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

    // which "type" values create an <input> element?
    var inputTypes = [
        'text',
        'password',
        'number',
        'email',
        'date',
        'url',
        'checkbox',
        'radio',
        'hidden',
        'file'
    ];


    // regex used to test/split tag string
    var reTagSplit = /[:#.?=|]/;

    var reFragPrefix = /^[!#]/;

    // use these as a shortcut to create <input> elements:
    // x0.spawnElement('input:text')
    // --> <input type="text">
    var inputTags = inputTypes.map(function(type){
        return 'input:' + type;
    });


    function isVoidElement(el){
        return el && el.nodeName && voidElements.indexOf(el.nodeName.toLowerCase()) > -1;
    }


    function checkDataset(){
        return (window.useDataset = document.head.dataset)
    }
    var useDataset = checkDataset();


    // add a single [data-*] attribute from `name` and `val`
    function addDataAttr(el, name, val){
        if (useDataset) {
            el.dataset[x0.toCamelCase(name)] = val;
        }
        else {
            el.setAttribute('data-' + x0.toDashed(name), val);
        }
    }

    // add multiple [data-*] attributes defined in an object
    function addDataAttrs(el, dataObj){
        x0.forOwn(dataObj, function(name, val){
            addDataAttr(el, name, val);
        });
    }


    function checkClassList(){
        return (window.useClassList = document.head.classList);
    }
    var useClassList = checkClassList();


    // return array of classes for `el` element
    function getClasses(el){
        return el.className.split(/\s+/);
    }


    function hasClassName(el, className){
        if (useClassList) {
            return el.classList.contains(className);
        }
        else {
            return getClasses(el).indexOf(className) > -1;
        }
    }


    function addClassName(el, newClass){
        var classes    = useClassList ? [] : getClasses(el);
        var newClasses = [].concat(newClass || []).join(' ').split(/\s+/);
        x0.forEach(newClasses, function(newCls){
            if (!newCls) return;
            if (useClassList) {
                el.classList.add(newCls);
            }
            else {
                if (!hasClassName(el, newCls)) {
                    classes.push(newCls);
                }
            }
        });
        if (!useClassList && classes.length) {
            el.className = classes.join(' ').trim();
        }
        return el.className;
    }


    function parseAttrs(el, attrs){
        // allow 'attrs' to be a string or array
        // use '|' for attribute delimiter
        x0.forEach((x0.isString(attrs) ? attrs.split('|') : attrs), function(attr, i){
            if (!attr) return;
            // use '=' for key/value separator
            var sep = '=';
            var key = attr.split(sep)[0].trim();
            // don't even TRY to insert html or text content this way
            if (/^(html|innerHTML|text|textContent)$/i.test(key)) {
                console.warn('Content cannot be added as an attribute.');
                return;
            }
            // remove quotes around values
            var quotes = /^['"]+|['"]+$/g;
            // value for boolean attributes will be set to the name of the attribute
            var val    = (attr.split(sep)[1] || '').trim().replace(quotes, '') || key;
            // allow use of 'class', but (secretly) use 'className'
            if (key === 'class') {
                el.className = val;
                return;
            }
            try {
                // if (key in el) {
                //     el[key] = val;
                // }
                el.setAttribute(key, val);
            }
            catch(e) {
                console.warn(e);
            }
        });
    }


    function parseTagString(str){

        // split tag parts and attributes
        var parts = str.split('|');

        // the first item in [parts] will be the tag name, and any specified id or classes
        var tagString = (parts.shift()).trim();

        var value, name, inputType;

        var reNameSep      = /[?]/;
        var reValueSep     = /[=]/;
        var reInputTypeSep = /[:/]/;

        if (reNameSep.test(tagString)) {
            name      = tagString.split(reNameSep)[1] || '';
            tagString = tagString.split(reNameSep)[0];
            if (reValueSep.test(name)) {
                value = name.split(reValueSep)[1];
                name  = name.split(reValueSep)[0];
            }
        }

        // if there are classes in the tag parts, get those
        var classes = tagString.split('.');

        // separate the id (if present) from the classes
        var tagParts = (classes.shift()).split('#');

        var tag = (tagParts.shift() + '');

        // if there's anything left in [tagParts], it will contain the id
        var id = tagParts && tagParts.length ? tagParts[0] : '';

        // special handling for <input> elements
        // x0.spawnElement('input:text?something=nothing')
        // x0.spawnElement('input/text?something=nothing')
        // -->  <input type="text" name="something" value="nothing">

        if (reInputTypeSep.test(tag)) {
            inputType = tag.split(reInputTypeSep)[1] || '';
            tag       = tag.split(reInputTypeSep)[0];
        }

        // there should be a tag by now, so create the element
        var ELEMENT = document.createElement(tag);

        // if an id was found above, apply it to the element
        if (id) {
            ELEMENT.id = id
        }

        // if the element is an input with a specified type, apply the type value
        if (x0.hasOwn(ELEMENT, 'type') && inputType) {
            ELEMENT.type = inputType;
        }

        // if a name was specified as `?inputName` apply that here
        if (x0.hasOwn(ELEMENT, 'name') && name) {
            ELEMENT.name = name;
        }

        if (x0.hasOwn(ELEMENT, 'value') && value) {
            ELEMENT.value = value;
            // ELEMENT.setAttribute('value', value);
        }

        // if there are items in [classes], add them
        if (classes.length) {
            ELEMENT.className = classes.join(' ').trim();
        }

        // if there are any attributes, they'll be in [parts]
        if (parts.length) {
            parseAttrs(ELEMENT, parts)
        }

        return ELEMENT;

    }


    // allow HTML to be inserted into an existing fragment by creating
    // a temporary `div`, setting its `innerHTML`, then appending
    // each child element of the temporary `div` to the fragment
    function appendToFragment(frag, content){
        var div       = document.createElement('div');
        div.innerHTML = content;
        while (div.firstChild) {
            frag.appendChild(div.firstChild)
        }
        return frag;
    }


    function appendChildren(el, children, fn){
        if (!children) {
            return;
        }
        if (isVoidElement(el)) {
            console.warn('Cannot insert content into void elements.');
            return;
        }
        x0.forEach([].concat(children), function(child){
            if (child == null) {
                return;
            }
            try {
                if (x0.isArray(child)) {
                    el.appendChild(fn.apply(el, child))
                }
                else if (x0.stringable(child)) {
                    if (x0.isFragment(el)) {
                        appendToFragment(el, child);
                    }
                    else {
                        el.innerHTML += child;
                    }
                }
                else {
                    el.appendChild(child);
                }
            }
            catch(e) {
                console.warn(e);
                console.warn(child);
                // try appending with jQuery
                // if native .appendChild() fails
                if (window.jQuery) {
                    jQuery(el).append(child);
                }
            }
        });
        return el;
    }


    function applyFn(method, args){
        var ELEMENT = this;
        if (x0.isFunction(ELEMENT[method])) {
            try {
                ELEMENT[method].apply(ELEMENT, [].concat(args))
            }
            catch(e) {
                console.warn(e)
            }
        }
    }


    // common function for attaching event listeners
    function addListeners(type, fn){
        var ELEMENT = this;
        var ARGS    = x0.isArray(fn) ? fn.unshift(type) : arguments;
        ELEMENT.addEventListener.apply(ELEMENT, ARGS);
    }

    // common function for *removing* event listeners
    function removeListeners(evts, fn){
        var ELEMENT = this;
        var ARGS    = x0.isArray(fn) ? fn.unshift(evts) : arguments;
        ELEMENT.removeEventListener.apply(ELEMENT, ARGS);
    }

    x0.on = function(evt, el, fn) {
        x0(el).each(function(ELEMENT, i){
            ELEMENT.addEventListener(evt, fn);
        });
    };

    x0.off = function(evt, el){
        x0(el).each(function(ELEMENT, i){
            x0.forEach([].concat(evt), function(name, i){
                ELEMENT.removeEventListener(name);
            });
        });
    };

    // map these method names to attrs to add
    // in all methods, [this] refers to the created element
    var OPT_METHODS        = {

        html: function _html(html){
            this.innerHTML = ((html || '') + '');
        },

        text: function _text(txt){
            this.textContent = ((txt || '') + '');
        },

        // [contents] can be any item that could
        // also work as a third argument for x0.createElement
        // ...string or array (of strings or config arrays)
        // WARNING: [contents] *REPLACES* any existing content
        // ...use [append] to add content
        contents: function _contents(contents, fn){
            this.innerHTML = '';
            x0.forEach([].concat(contents), function(content){
                this.appendChild(fn('!', content))
            }, this);
        },

        append: function _append(content, fn){
            appendChildren(this, [content], fn);
        },

        appendHTML: function _appendHTML(html){
            this.innerHTML += ((html || '') + '');
        },

        appendTo: function _appendTo(parent){
            if (x0.isString(parent)) {
                parent = document.querySelector(parent);
            }
            parent.appendChild(this);
        },

        attr: function _attr(attrs){
            var ELEMENT = this;
            x0.forOwn(attrs, function(attr, val){
                ELEMENT.setAttribute(attr, val);
            }, this);
        },

        prop: function _prop(props){
            var ELEMENT = this;
            x0.forOwn(props, function(prop, val){
                ELEMENT[prop] = val;
            }, this)
        },

        data: function _data(dataObj){
            addDataAttrs(this, dataObj);
        },

        value: function _value(val){
            if ('value' in this) {
                try {
                    // this.setAttribute('value', val);
                    this.value = val;
                }
                catch(e) {
                    console.warn(e);
                }
            }
        },

        style: function _style(styleObj){
            var ELEMENT = this;
            x0.forOwn(styleObj, function(prop, val){
                var propName            = prop + '';
                // var propName = x0.toCamelCase(prop);
                ELEMENT.style[propName] = val;
            }, this)
        },

        checked: function _checked(bool){
            if (/checkbox|radio/i.test(this.type)) {
                if (/true|checked/i.test(bool)) {
                    this.checked = true;
                    this.setAttribute('checked', '');
                }
                else {
                    this.checked = false;
                    this.removeAttribute('checked')
                }
            }
        },

        disabled: function _disabled(bool){
            if (/true|disabled/i.test(bool)) {
                this.disabled = true;
                this.setAttribute('disabled', '');
            }
            else {
                this.disabled = false;
                this.removeAttribute('disabled');
            }
        },

        addClass: function _addClass(className){
            addClassName(this, className)
        },

        method: function _method(mthd){
            // only set 'method' attribute to <form> elements
            if (!/FORM/i.test(this.nodeName)) {
                return;
            }
            // only allow 'get' and 'post' for the [method] attribute
            if (/get|post/i.test(mthd)) {
                this.setAttribute('method', mthd);
            }
            // always set [data-method]
            this.setAttribute('data-method', mthd);
        },

        href: function _href(url){
            this.setAttribute('href', url);
        },

        src: function _src(url){
            this.setAttribute('src', url);
        },

        // [fn] can be any native element method...
        // otherwise fn will not execute with a console warning
        // fn: { appendChild: document.createElement('textarea') }
        // fn: ['appendChild', document.createElement('textarea') ]
        // fn: [
        //       [ 'setAttribute', ['title', 'Super Bogus'] ],
        //       [ 'appendChild', x0.createElement('h3', 'Foo Bar') ],
        //       [ 'appendChild', x0.createElement('ul.foo', [['li.bar']]) ]
        // ]
        fn: function _fn(/* ['fnName', ['arg1', 'arg2']] */){
            var ELEMENT = this;
            var ARG     = arguments[0];
            // var fnName = ARG[0];
            // var fnArgs = ARG[1];
            if (x0.isPlainObject(ARG)) {
                x0.forOwn(ARG, function(fnName, fnArgs){
                    applyFn.apply(ELEMENT, [fnName].concat(fnArgs))
                }, this);
            }
            else if (x0.isArray(ARG[0])) {
                x0.forEach(ARG, function(args, i){
                    var fnName = args.shift();
                    applyFn.apply(ELEMENT, [fnName].concat(args))
                }, this);
            }
            else {
                applyFn.apply(ELEMENT, ARG);
            }
        },

        // on: {
        //     'click': function(e){ console.log(this) },
        //     'mouseover': function(e){ console.log('hovering' ) }
        // }
        // on: [ 'click', function(e){ console.log(this) } ]
        //
        // use 2-D array to attach multiple listeners of the same type
        // NOTE: these will be fired simultaneously
        // on: [
        //     ['click', doSomething ],
        //     ['click', doAnotherThing ]
        // ]
        on: function _on(/* ['evtType', function(e){}] */){
            var ELEMENT = this;
            var ARG     = arguments[0];
            // most common case would likely be a config object
            if (x0.isPlainObject(ARG)) {
                x0.forOwn(ARG, function(type, args){
                    addListeners.apply(ELEMENT, [type].concat(args));
                }, this);
            }
            else if (x0.isArray(ARG[0])) {
                x0.forEach(ARG, function(args, i){
                    // the shift() then concat() is necessary
                    // because 'args' could be a single argument
                    // or array of multiple arguments
                    var type = args.shift();
                    addListeners.apply(ELEMENT, [type].concat(args));
                }, this);
            }
            else {
                addListeners.apply(ELEMENT, ARG);
            }
        }
    };
    // some aliases?
    OPT_METHODS.css        = OPT_METHODS.style;
    OPT_METHODS.classes    = OPT_METHODS.addClass;
    OPT_METHODS.content    = OPT_METHODS.contents;
    OPT_METHODS.appendHtml = OPT_METHODS.appendHTML;
    OPT_METHODS.htmlAppend = OPT_METHODS.appendHTML;

    // bonus methods
    OPT_METHODS.appendTo  = function _appendTo(container){
        if (x0.isElement(container)) {
            container.appendChild(this);
        }
        else if (x0.isString(container)) {
            document.querySelector(container).appendChild(this)
        }
    };
    OPT_METHODS.container = OPT_METHODS.appendTo;



    /**
     * Create a DOM element with specified properties and content
     * @param {String|Element} tag
     * @param {Object|Array|String} [opts]
     * @param {Array|String} [contents]
     * @returns {HTMLElement}
     * @example createElement('div#foo.bar', { title: 'The bar is foo' }, ['How foo is your bar?'])
     * @example createElement('input|name=bogus', { value: getQueryStringValue('bogus') }, 'This is bogus.')
     */
    function createElement(tag, opts, contents){

        var ELEMENT;

        var argLen = arguments.length;

        // object to hold local variables
        var CFG = {};

        if (argLen === 1 && !x0.isString(tag)) {
            // handle passing an array with the arguments
            if (x0.isArray(tag)) {
                CFG.tag      = tag[0];
                CFG.opts     = tag[1];
                CFG.contents = tag[2];
            }
            else if (x0.isPlainObject(tag)) {
                CFG      = x0.extend(true, {}, tag);
                CFG.opts = CFG.opts || CFG.config || CFG || null;
                delete CFG.opts.opts;
                delete CFG.opts.config;
                CFG.tag      = CFG.tag || '!';
                CFG.contents = CFG.contents || CFG.content || [];
            }
        }
        else {
            CFG.tag      = tag || '!';
            CFG.opts     = opts || null;
            CFG.contents = contents || '';
        }

        if (argLen === 2) {
            if (x0.isString(opts)) {
                CFG.opts.innerHTML = opts;
            }
            else if (x0.isArray(opts)) {
                CFG.contents = opts;
                CFG.opts     = null;
            }
            else if (opts === true) {
                CFG.cloneElement = true;
            }
        }

        // pass an element as the [tag] to modify it
        if (x0.isElement(CFG.tag)) {
            ELEMENT = CFG.tag;
        }
        else {
            if (reFragPrefix.test(CFG.tag)) {
                ELEMENT = document.createDocumentFragment();
                appendChildren(ELEMENT, CFG.contents || '', createElement);
                return ELEMENT;
            }
            // if (CFG.tag.indexOf('<!--') === 0) {
            //     // should we support creation of comment nodes?
            // }

            // create element and process attributes contained in the [tag] string
            if (reTagSplit.test(CFG.tag)) {
                // parse the `tag` string and apply to a newly created element
                ELEMENT = parseTagString(CFG.tag);
            }
            else {
                ELEMENT = document.createElement(CFG.tag);
            }
        }

        if (!CFG.opts && !CFG.contents) {
            return ELEMENT;
        }

        if (ELEMENT.nodeName === 'INPUT' && CFG.opts.type) {
            ELEMENT.type = CFG.opts.type;
            delete CFG.opts.type;
        }

        // process the {opts} object
        x0.forOwn(CFG.opts, function(name, val){
            if (x0.hasOwn(OPT_METHODS, name)) {
                OPT_METHODS[name].call(ELEMENT, val, createElement);
            }
            // allow shortcuts for adding [data-*] attributes?
            else if (/^data[A-Z]+/.test(name)) {
                // allow use of dataFoo: 'bar' to add [data-foo="bar"] attribute
                addDataAttr(ELEMENT, name, val);
            }
            else {
                try {
                    if (x0.hasOwn(ELEMENT, name)) {
                        ELEMENT[name] = val;
                    }
                    else {
                        ELEMENT.setAttribute(name, val);
                    }
                }
                catch(e) {
                    console.warn(e);
                }
            }
        }, ELEMENT);

        if (CFG.contents) {
            appendChildren(ELEMENT, CFG.contents, createElement);
        }

        // RETURN THE CREATED ELEMENT
        return ELEMENT;

    }
    window.x0.createElement = createElement;





    /**
     * Returns an HTML DOM element with the specified properties.
     * Faster and leaner than createElement, but more strict about argument types.
     * @param {String|Array} tag - element tagName or array of arguments
     * @param {Object|Array|String|null} [opts] - element properties and attributes
     * @param {Array|String} [contents] - child content
     * @example
     * x0.spawnElement('div#for.bar.baz', { title: 'Foo time!'}, [
     *     ['b', "It's foo time, kids!"],
     *     '<br>',
     *     ['small', {style: {color: 'cornflowerblue' }}, [
     *         ['i', "(it's time for foo)"]
     *     ]]
     * ]);
     * // =>
     * <div id="for" class="bar baz" title="Foo time!">
     *     <b>It's foo time, kids!</b>
     *     <br>
     *     <small style="color: cornflowerblue"><i>(it's time for foo)</i></small>
     * </div>
     */
    function spawnElement(tag, opts, contents){

        var ELEMENT;

        var CFG = {
            tag: tag || '!',
            opts: opts || null,
            contents: contents || null
        };

        if (x0.isString(CFG.tag)) {
            // process attributes contained in the [tag] string
            if (reTagSplit.test(CFG.tag)) {
                // parse the `tag` string and apply to a newly created element
                ELEMENT = parseTagString(CFG.tag);
            }
            // allow spawning of fragments if first character in [tag] is '!' or '#'
            else if (reFragPrefix.test(CFG.tag)) {
                ELEMENT    = document.createDocumentFragment();
                CFG.isFrag = true;
            }
            else {
                ELEMENT = document.createElement(CFG.tag);
            }
        }
        // handle possible situation where the first argument
        // may actually be an array of all the arguments
        else if (x0.isArray(CFG.tag)) {
            ELEMENT = spawnElement.apply(null, CFG.tag);
        }
        // pass an element as the [tag] to modify it?
        else if (x0.isElement(CFG.tag)) {
            ELEMENT = CFG.tag;
        }

        if (!CFG.opts && !CFG.contents) {
            //////////////////////////////
            // RETURN ELEMENT
            return ELEMENT;
            //////////////////////////////
        }

        // fastest usage:
        // x0.spawnElement('div#foo.bar.baz', '<b>HTML</b> content!')
        if (CFG.tag && (CFG.opts || CFG.contents)) {
            if (x0.isString(CFG.opts)) {
                CFG.contents = CFG.opts;
                CFG.opts     = null;
                if (CFG.isFrag) {
                    appendToFragment(ELEMENT, CFG.contents);
                }
                else {
                    ELEMENT.innerHTML = CFG.contents;
                }
                //////////////////////////////
                // RETURN DOCUMENT FRAGMENT
                return ELEMENT;
                //////////////////////////////
            }
            else if (x0.isArray(CFG.opts)) {
                CFG.contents = CFG.opts;
                CFG.opts     = null;
            }
        }

        if (CFG.opts) {
            x0.forOwn(CFG.opts, function(name, val){
                if (x0.hasOwn(OPT_METHODS, name)) {
                    OPT_METHODS[name].call(ELEMENT, val, spawnElement);
                }
                else {
                    try {
                        if (name in ELEMENT) {
                            ELEMENT[name] = val;
                        }
                        else {
                            ELEMENT.setAttribute(name, val);
                        }
                    }
                    catch(e) {
                        console.warn(e);
                    }
                }
            }, ELEMENT);
        }

        if (CFG.contents) {
            appendChildren(ELEMENT, CFG.contents, spawnElement);
        }

        //////////////////////////////
        // RETURN SPAWNED ELEMENT
        return ELEMENT;
        //////////////////////////////
    }

    return window.x0.spawnElement = spawnElement;

    // function SpawnElement(){
    //     this.spawned = spawnElement.apply(this, arguments);
    // }
    //
    // SpawnElement.fn = SpawnElement.prototype;
    //
    // SpawnElement.fn.get = function(){
    //     return this.spawned;
    // };
    //
    // // add x0.spawnElement `OPT_METHODS` as instance methods
    // x0.forOwn(OPT_METHODS, function(name, fn){
    //     SpawnElement.fn[name] = function(){
    //         return fn.apply(this.spawned, arguments);
    //     };
    // });
    //
    // x0.forOwn(OPT_METHODS, function(name, fn){
    //     spawnElement.prototype[name] = function(){
    //         return fn.apply(this, arguments);
    //     };
    // });

    // x0.spawnElement('input|type=text|name=bogus', {
    //     value: getQueryStringValue('bogus'),
    //     attr: { placeholder: '(bogus)' }
    // }, ['This is bogus.']);

    // return window.x0.spawnElement = function _spawnElement(tag, attr, content){
    //     return new SpawnElement(tag, attr, content);
    // };

}));
