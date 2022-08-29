import React from 'react';
import { hot } from 'react-hot-loader/root';
import { IconContext } from 'react-icons';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routes } from 'routes';

const App: React.FC = () => {
     return (
          <BrowserRouter>
               <IconContext.Provider value={{
                    className: 'icon'
               }}>
                    <div className="app">
                         <ToastContainer
                              autoClose={2000}
                         />

                         <Switch>
                              {routes.map((route, i) => (
                                   <Route key={i} path={route.path} component={route.component} exact={route.exact} />
                              ))}

                              <Route>
                                   <main>
                                        <section>
                                             <h1>Route not found.</h1>
                                        </section>
                                   </main>
                              </Route>
                         </Switch>
                    </div>
               </IconContext.Provider>
          </BrowserRouter>
     )
}

export default hot(App);