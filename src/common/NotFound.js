import React, { Component } from 'react';
import './NotFound.css';
import LinkButton from "../util/LinkButton";

class NotFound extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    404
                </h1>
                <div className="desc">
                    The Page you're looking for was not found.
                </div>
                <LinkButton className={"btn btn-primary"} to="/">Go Back</LinkButton>
            </div>
        );
    }
}
export default NotFound;
