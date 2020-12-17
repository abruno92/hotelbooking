import {Link} from "react-router-dom";
import React, {Component} from "react";
import {withRouter} from "react-router";
import {AuthService} from "../../services/auth";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(e) {
        e.preventDefault();
        if (this.state.loading) return;

        this.setState({
            loading: true,
        });

        try {
            await AuthService.logout();
        } catch (ignored) {}

        this.setState({
            loading: false,
        });
        this.props.history.push('/login');
    }

    render() {
        const loading = this.state.loading;
        return (
            <Link to="" onClick={this.handleClick} style={{marginTop: "5px"}}>
                {loading ?
                    <>Loading...</> :
                    <>Logout</>
                }
            </Link>
        )
    }
}

export default withRouter(Logout);