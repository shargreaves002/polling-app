import Dropdown from "react-bootstrap/Dropdown";
import React from "react";
import history from "../util/history";

export class ProfileDropdownMenu extends React.Component {

    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(key) {
        if(key === "logout") {
            this.props.handleLogout();
        } else {
            history.push(key);
        }
    }

    render() {
        return (
            <Dropdown className={"d-inline-block"} alignRight>
                <Dropdown.Toggle id={"profile-dropdown"}>Profile</Dropdown.Toggle>
                <Dropdown.Menu>
                    <div className={"text-center"}>
                        {this.props.currentUser.name}
                        <br />
                        @{this.props.currentUser.username}
                    </div>
                    <Dropdown.Item as={"button"} className={"text-center"} onClick={() => this.handleMenuClick("/users/" + this.props.currentUser.username)}
                                   key={"/profile"}>Profile</Dropdown.Item>
                    <Dropdown.Item as={"button"} className={"text-center"} onClick={() => this.handleMenuClick("logout")} key={"logout"}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
