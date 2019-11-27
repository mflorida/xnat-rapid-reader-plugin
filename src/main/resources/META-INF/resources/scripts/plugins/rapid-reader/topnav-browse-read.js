/*
 * web: topnav-browse.js
 * XNAT http://www.xnat.org
 * Copyright (c) 2005-2017, Washington University School of Medicine and Howard Hughes Medical Institute
 * All Rights Reserved
 *
 * Released under the Simplified BSD.
 */

/**
 * Manage visibility of items in the top nav bar
 */

(function($, XNAT){

    var $rapidReadMenu = $('#rapid-read-menu');
    var jsdebug        = window.jsdebug;
    var undef;

    function displayMenuList($container, items){
        if (!items.length) return;
        // add a filter row if there are more than 10 items
        var _menuItem = spawn('li.table-list');
        if (items.length > 10) {
            XNAT.table.dataTable([], {
                container: _menuItem,
                sortable: false,
                filter: 'item',
                header: false,
                body: false,
                items: {
                    item: 'list-item'
                }
            });
        }
        XNAT.table.dataTable(items, {
            container: _menuItem,
            sortable: false,
            header: false,
            items: {
                _name: '~data-name',
                item: 'list-item'
            }
        });
        $container.html('').append(_menuItem).parents('li').removeClass('hidden');
    }

    function compareSearches(a, b){
        // sort alphabetically by the brief_description field, accounting for accented characters if necessary.
        return a.brief_description.toLowerCase().localeCompare(b.brief_description.toLowerCase());
    }


    // call 'test' at 'interval' until it returns true
    // then execute 'callback' -- basic but useful
    function waiting(interval, test, callback){
        var _test = test;
        if (typeof test !== 'function') {
            _test = function(){
                return !!test;
            };
        }
        var waiting = setInterval(function(){
            if (_test()) {
                var called = callback();
                clearInterval(waiting);
                return called;
            }
        }, interval || 1);
        return waiting;
    }

    // wait for element to show up in the DOM
    // then execute callback
    function removeMenuItem(item){
        var counter = 0;
        var START   = performance && performance.now ? performance.now() : Date.now();
        var END     = START + 5000; // no more than 5 seconds.
        var WAIT    = 10;
        var tick    = START;
        var $element;
        waiting(WAIT, function(){
            tick += WAIT;
            // don't wait more than 5 seconds
            if (tick >= END) {
                return true;
            }
            if (++counter > 500) {
                return true;
            }
            if (window.jsdebug) {
                // console.log('waiting for element: ' + selector);
            }
            $element = $('#stored-search-menu tr[data-name="' + item.brief_description + '"]');
            if ($element.length) {
                $element.remove();
                return true;
            }
            return $element.length;
        }, function(){
            if (tick >= END || counter > 500) {
                console.warn('can\'t find element');
            }
            else {
                if (jsdebug) {
                    // console.log('element found: ' + selector);
                }
                console.log('"' + item.brief_description + '" menu item moved.');
            }
        });
    }

    function isWorkList(item){
        return (/^(read|worklist)/i.test(item.brief_description) || /^(rapid reader|worklist)/i.test(item.description)) && /SessionData$/i.test(item.root_element_name);
    }

    function parseDescription(desc){
        return desc.split(/worklist/i).slice(1).join('').split(/[,]/).map(function(part, i){
            return (part.replace(/^[\W]+|[\W]+$/g, '').trim());
        }).filter(item => !!item);

    }

    function worklistConfig(item){

        var cfg = {
            isWorkList: isWorkList(item)
        };

        parseDescription(item.description).forEach(function(part, i){
            var key = part.split(/[:=]/)[0].trim().replace(/[\W\s]+/, '_').toLowerCase();
            var val = part.split(/[:=]/)[1].trim();
            cfg[key] = val.trim();
        });

        return cfg;

    }

    // move items from stored search list to 'Read' menu list
    XNAT.xhr.getJSON({
        url: XNAT.url.restUrl('/data/search/saved', ['format=json']),
        success: function(data){
            if (data.ResultSet.Result.length) {
                var STORED = [];
                data.ResultSet.Result.sort(compareSearches).forEach(function(item){

                    var titleParts, config, label, searchId, templateId, URL;

                    if (isWorkList(item)) {

                        titleParts = item.brief_description.split(/[|:]/);

                        config = worklistConfig(item);

                        searchId   = item.id;
                        templateId = (titleParts[2] || '').trim() || '-';
                        label      = (titleParts[1] || titleParts[0] || `Read Data (${item.root_element_name})`).trim();

                        // need to wait for any elements to show up in the 'Stored Searches' menu and remove them
                        // this function is super hacky but...
                        removeMenuItem(item);

                        if (config.template_id) {
                            templateId = config.template_id;
                        }
                        else if (config.template_url) {
                            templateId = config.template_url.replace(/\/+/g, ':');
                        }

                        URL = XNAT.url.rootUrl('/read/#/worklists/' + searchId + '/' + templateId + '/');

                        STORED.push({
                            name: label,
                            item: spawn('a', {
                                href: URL,
                                attr: { target: '_blank' },
                                style: { width: '100%' }
                            }, escapeHtml(label))
                        });
                    }
                });
                if (STORED.length) {
                    displayMenuList($rapidReadMenu, STORED);
                }
            }
        },
        error: function(e){
            console.log(e);
        }
    });

})(window.jQuery, window.XNAT);
