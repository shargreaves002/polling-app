import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AppHeader.css';
import LinkButton from "../util/LinkButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import {ProfileDropdownMenu} from "./ProfileDropdownMenu";

export class AppHeader extends Component {

    render() {
        let menuItems;
        if(this.props.currentUser) {
            menuItems = [
                <LinkButton to={'/'} className={"btn btn-primary mr-1"} key={"/"}>Home</LinkButton>,
                <LinkButton to={'/poll/new'} className={"btn btn-primary mx-1"} key={"/poll/new"}>New Poll</LinkButton>,
                <ProfileDropdownMenu className={"ml-1 d-inline-block"} currentUser={this.props.currentUser}
                                         handleMenuClick={this.handleMenuClick} handleLogout={this.props.handleLogout} key={"ProfileMenuDropdown"}/>

            ];
        } else {
            menuItems = [
                <LinkButton to={'/login'} className={"btn btn-primary mr-1"} key={"/login"}>Login</LinkButton>,
                <LinkButton to={'/signup'} className={"btn btn-primary ml-1"} key={"/signup"}>Sign Up</LinkButton>
            ];
        }

        return (
            <div className="app-header">
                <div className="container">
                    <div className="app-title" >
                        <Link to="/">Polling App</Link>
                    </div>
                    <div
                        className="app-menu"
                        style={{ lineHeight: '64px' }} >
                        {menuItems}
                    </div>
                </div>
            </div>
        );
    }
}
