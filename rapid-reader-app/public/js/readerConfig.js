/*!
 * Define global constants for server configuration
 */

(function(){

    window.readerConfig = window.readerConfig || {};

    var _app     = '/read';
    var _context = window.siteRoot || '';
    var _host    = window.location.protocol + '//' + window.location.host;

    var server = {
        // `context` is the context of the XNAT instance on the server
        // if ROOT, leave as empty string, otherwise omit trailing slash
        // '/urxnat'
        app: _app,
        context: _context,
        host: _host,
        siteUrl: _host + _context,
        appUrl: _host + _context + _app
    };

    server.info = window.sessionInfo || (function(){
        var out = [];
        var i   = -1;
        while (++i <= 4) {
            out.push('');
        }
        return out;
    })();

    var viewer = {
        // toolbar tools to hide when the Rapid Reader viewer loads
        hideTools: [
            'toggleCineDialog',
            'wwwc',
            'pan',
            'Annotations',
            'Freehand',
            'Brush',
            'delete',
            'toggleMore',
            'aiaaAnnotate',
            'aiaaSegment'
        ],
        hidePanels: [
            // ['.selector', 'class-to-remove']
            ['.sidebarMenu.sidebar-left', 'sidebar-open'],
            ['.sidebarMenu.sidebar-right', 'sidebar-open'],
        ],
        removeElements: [
            '.roundedButtonWrapper[data-value="changeSession"]'
        ]
    };

    viewer.hideSelectors = viewer.hideTools.map(function(id){
        return `#${id}.toolbarSectionButton`;
    });

    // viewer.hideSelectors.push('[data-value="changeSession"]');

    // 'export' these globally
    window.readerConfig.server = server;
    window.readerConfig.viewer = viewer;

})();
