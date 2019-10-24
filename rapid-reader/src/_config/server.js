/*!
 * Define global constants for server configuration
 */

const _app = '/read';
const _context = '';
const _host = window.location.protocol + '//' + window.location.host;

export const server = {
    // `context` is the context of the XNAT instance on the server
    // if ROOT, leave as empty string, otherwise omit trailing slash
    // '/urxnat'
    app: _app,
    context: _context,
    host:    _host,
    siteUrl: _host + _context,
    appUrl: _host + _context + _app
};
