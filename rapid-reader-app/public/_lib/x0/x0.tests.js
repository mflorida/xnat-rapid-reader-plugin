 /**
 * Tests for x0 and x$ methods, compared to jQuery and native DOM methods
 */

(function($, x0, x$){

    var undef;

    var performanceNow = performance.now || false;

    function speedTime(start){
        return ((performanceNow ? performance.now() : Date.now()) - start);
    }

    function speedTest(fn, args, count, context){

        var i         = -1,
            argsArray = [].concat(args || []),
            result    = null,
            results   = [],
            start     = performanceNow ? performance.now() : Date.now(),
            output    = {};

        if (fn === undef) {
            return 'Test function is undefined.';
        }

        count   = count || 1000;
        context = context || null;

        // collect any results
        while (++i < count) {
            try {
                result = fn.apply(context, argsArray);
            }
            catch(e) {
                result = e;
            }
            results.push(result);
        }

        if (!results.length) {
            return result;
        }

        output.time       = speedTime(start);
        output.results    = results;
        output.lastResult = result;

        console.log(output.time);

        return output;

    }
    x0.speedTest = speedTest;


    // test speed but only collect success/failure
    function speedTestExe(fn, args, count, context){

        var i         = -1,
            argsArray = [].concat(args || []),
            result    = null,
            results   = { success: 0, error: 0 },
            start     = performanceNow ? performance.now() : Date.now(),
            output    = {};

        if (fn === undef) {
            return 'Test function is undefined.';
        }

        count   = count || 1000;
        context = context || null;

        // record success or failure
        while (++i < count) {
            try {
                result = fn.apply(context, argsArray);
                results.success += 1;
            }
            catch(e) {
                result = e;
                results.error += 1;
                break;
            }
        }

        output.time       = speedTime(start);
        output.results    = results;
        output.lastResult = result;

        console.log(output.time);

        return output;

    }
    x0.speedTestExe = speedTestExe;



    // selectors must be an array with the following signature:
    // ['id', 'className', 'tagName', 'name']
    var testConfig = {
        selectors: {
            id: 'hipsum-text',
            className: 'filler',
            tagName: 'p',
            name: 'hidden-input'
        },
        domMethods: {
            id: 'getElementById',
            className: 'getElementsByClassName',
            tagName: 'getElementsByTagName',
            name: 'getElementsByName'
        }
    };
    var tests = {
        dom: {
            selector: {
                id: 'hipsum-text'
            },
            method: {

            },
            selectors: ['hipsum-text', 'filler', 'p', 'hidden-input'],
            methods: [
                'getElementById',
                'getElementsByClassName',
                'getElementsByTagName',
                'getElementsByName'
            ]
        },
        domAll: {
            selectors: ['#hipsum-text', '.filler', 'p', '[name="hidden-input"]']
        },
        jQuery: {
            selectors: ['#hipsum-text', '.filler', 'p', '[name="hidden-input"]']
        },
        x0: {
            selectors: ['#|hipsum-text', '.|filler', '~|p', '?|hidden-input']
        },
        x$: {
            selectors: ['#:hipsum-text', '..filler', '~p', '?hidden-input']
        }
    };



    // TEST NATIVE DOM METHODS
    tests.dom.getElements = function(selectors){
        selectors = selectors || tests.dom.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x0.toArray(document[tests.dom.methods[i]](selector))
        })
    };
    //
    tests.dom.queryAll = function(selectors){
        selectors = selectors || tests.domAll.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x0.toArray(document.querySelectorAll(selector))
        })
    };



    // TEST jQuery METHODS
    tests.jQuery.getElements = function(selectors){
        selectors = selectors || tests.jQuery.selectors;
        return [].concat(selectors).map(function(selector, i){
            return $(selector).get();
        })
    };
    tests.jQuery.queryAll = function(selectors){
        selectors = selectors || tests.domAll.selectors;
        return [].concat(selectors).map(function(selector, i){
            return $(document.querySelectorAll(selector)).get();
        })
    };
    //
    //
    tests.jQuery.fillText = function(){
        return $('.filler').text(function(){
            return x0.hipsum.sentence();
        });
    };
    //
    tests.jQuery.fillHTML = function(){
        return $('.hipsum-html').html(x0.hipsum.paragraph);
    };



    // TEST x0 METHODS
    tests.x0.getElements = function(selectors){
        selectors = selectors || tests.x0.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x0(selector).get();
        })
    };
    //
    tests.x0.queryAll = function(selectors){
        selectors = selectors || tests.domAll.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x0('//' + selector).get();
        })
    };
    //
    tests.x0.fillText = function(){
        return x0('.|filler').text(function(){
            return x0.hipsum.sentence();
        });
    };
    //
    tests.x0.fillHTML = function(){
        return x0('.|hipsum-html').html(x0.hipsum.paragraph);
    };



    // TEST x$ METHODS
    tests.x$.getElements = function(selectors){
        selectors = selectors || tests.x$.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x$(selector);
        })
    };
    //
    tests.x$.queryAll = function(selectors){
        selectors = selectors || tests.domAll.selectors;
        return [].concat(selectors).map(function(selector, i){
            return x$('//' + selector);
        })
    };


    x0.tests = tests;


})(window.jQuery, window.x0, window.x$);
