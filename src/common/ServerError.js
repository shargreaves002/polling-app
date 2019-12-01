import React, { Component } from 'react';
import './ServerError.css';
import LinkButton from "../util/LinkButton";

class ServerError extends Component {
    render() {
        return (
            <div className="server-error-page">
                <h1 className="server-error-title">
                    500
                </h1>
                <div className="server-error-desc">
                    Oops! Something went wrong at our Server. Why don't you go back?
                </div>
                <LinkButton className={"btn btn-primary"} to="/">Go Back</LinkButton>
            </div>
        );
    }
}
export default ServerError;
