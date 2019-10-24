/*!
 * Define routes for navigation
 */

// import Home from '../Home';
import Worklists from '../Worklists';
import Worklist from '../Worklist';
import ViewSession from '../ViewSession';

export const routes = [
    // { path: '/login',     page: Login,     label: Login.name },
    {
        path: '/',
        exact: true,
        page: Worklists,
        label: 'Worklists'
    },
    // {
    //     path: '/home',
    //     page: Home,
    //     label: Home.name
    // },
    {
        path: '/worklists',
        exact: true,
        page: Worklists,
        label: 'Worklists'
    },
    {
        path: '/worklists/:searchId/:templateId',
        exact: true,
        page: Worklist,
        label: 'Search Results'
    },
    {
        path: '/worklists/:searchId/:templateId/:searchItemIndex/:searchItemsLength',
        exact: true,
        page: ViewSession,
        label: 'Session Data'
    }
    // { path: '/viewer',    page: Viewer ,   label: Viewer.name },
    // {
    //     exact: true,
    //     path: '/viewer/:proj/:subj/:expt',
    //     page: Viewer ,
    //     label: Viewer.name
    // },
    // // nothing matches? ERROR!
    // { path: '/error',  page: ErrorPage, label: 'Error' }
];

// keys to use for url hash for viewer loading
export const hashKeys = {
    PROJ: 'proj=',
    SUBJ: 'subj=',
    EXPT: 'expt=',
    LABEL: 'label='
};
