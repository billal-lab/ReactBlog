import React,{Component} from 'react';
import Navbar from './Navbar';
import Profil from './Profil';
import New from './New';
import {Route, Switch} from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import Publications from './Publications';

export default class Main extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Navbar/>
                        <div style={{top:"120px", position:"relative"}}>
                        <Switch>
                            <Route path="/" exact>
                                <Publications />
                            </Route>
                            <Route path="/publication" exact>
                                <Publications />
                            </Route>
                            <Route path="/publication/new" exact>
                                <New />
                            </Route>
                            <Route path="/publication/:id/edit" exact component={New}/>
                            <Route path="/profil" exact>
                                <Profil />
                            </Route>
                            <Route path="/logout" exact>
                            </Route>
                            <Route path="*">
                                <div className="justify justify-content-center">Ooops ! page not found</div>
                            </Route>
                        </Switch>
                        </div>
                </Router>

            </div>
        );
    }
}