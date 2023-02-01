import React from 'react';
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';

// reference `routes.js` for route values
import { routes } from './_config/routes';
import NotFound from './NotFound';

function App(props){
    return (
        <div id="app-wrapper">
            <HashRouter>
                <Switch>
                    {routes.map(function(route, i){
                        if (route.exact) {
                            return <Route exact path={route.path} component={route.page}/>
                        }
                        return <Route path={route.path} component={route.page}/>
                    })}
                    <Route component={NotFound}/>
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
