import React from 'react';
import { server } from '../_config/server';

function ViewerIframe(props){

    const { dataFields } = props;

    const VIEWER = 'VIEWER';

    function iframeSrc(){
        console.log('iframeSrc');
        // const dataFields = extractItem(data);
        // console.log(dataFields);
        const query = [
            `projectId=${dataFields.project}`,
            // `subjectId=${dataFields.xnat_subjectdata_subjectid}`,
            `experimentId=${dataFields.expt_id}`,
            `t=${Date.now()}`
        ];
        return `${server.siteUrl}/${VIEWER}/?${query.join('&')}`;
    }

    // pull this out for easier editing
    const viewerContainerStyle = {
        width: '75%',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        minHeight: 720
    };

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
    function waitForElement(selector, context, callback){
        var counter = 0;
        var START   = performance && performance.now ? performance.now() : Date.now();
        var END     = START + 10000; // no more than 10 seconds.
        var WAIT    = 10;
        var tick    = START;
        var selectedElement;
        waiting(WAIT, function(){
            tick += WAIT;
            // don't wait more than 10 seconds
            if (tick >= END) {
                return true;
            }
            if (++counter > 500) {
                return true;
            }
            // window.jsdebug &&
            console.log('waiting for element: ' + selector);
            (selectedElement = context.querySelector(selector)) && callback && callback.call(selectedElement, selectedElement);
            return !!selectedElement;
        }, function(){
            if (tick >= END || counter > 500) {
                console.warn('can\'t find element');
            }
            else {
                // window.jsdebug &&
                console.log('element found: ' + selector);
            }
        });
    }

    
    function hidePanels(doc){
        window.readerConfig.viewer.hidePanels.forEach(function(panel){
            waitForElement(panel[0], doc, function(selected){
                selected.classList.remove(panel[1]);
            })
        })
    }


    function removeElements(doc){
        window.readerConfig.viewer.removeElements.forEach(function(element){
            waitForElement(element, doc, function(selected){
                selected.remove();
            })
        })
    }

    
    // run this when the viewer loads
    function hideToolbarTools(doc){
        window.readerConfig.viewer.hideSelectors.forEach(function(selector){
            waitForElement(selector, doc, function(selected){
                selected.style.display = 'none'
            });
        });
    }


    function modifyViewer(e){

        console.log(e);
        console.log('loaded?');

        let iframe   = e.target;
        console.log(iframe);

        // compare then re-assign
        console.log(e.target === (iframe = document.getElementById('viewer-iframe')));
        console.log(iframe);

        let innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        hidePanels(innerDoc);
        removeElements(innerDoc);
        hideToolbarTools(innerDoc);

    }


    return (

        <div id="viewer-container" style={viewerContainerStyle}>
            <iframe id="viewer-iframe" onLoad={modifyViewer} src={iframeSrc()} title={dataFields.expt_id} width="100%" height="100%" style={{ border: 'none' }}/>
        </div>

    );
}

export default ViewerIframe;
