import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Main extends Component {
    render() {
        return (
            <nav className="navbar fixed-top navbar-light bg-info mb-5">
                <Link className="mx-5 navbar-brand" to="/">
                    <p>Pintrest</p>
                </Link>
                <div className="d-flex mx-3">
                    <Link className="mx-3" style={{textDecoration : "none"}} to="/publication/new">
                        <p className="text-dark">New publication <i class="fas fa-plus-square"></i></p>
                    </Link>
                    <Link className="mx-3" style={{textDecoration : "none"}} to="/profil">
                        <p className="text-dark">Profil <i class="fas fa-user-circle" ></i></p>
                    </Link>
                    <Link  style={{textDecoration : "none"}} to="/logout">
                        <p className="text-dark">Logout <i class="fas fa-sign-out-alt"></i></p>
                    </Link>
                </div>
            </nav>
        );
    }
}