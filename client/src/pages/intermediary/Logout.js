import {Link} from "react-router-dom";
import React, {Component} from "react";
import ApiAxios from "../../utils/ApiAxios";
import {withRouter} from "react-router";

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
        console.log("loading:" + this.state.loading);
        if (this.state.loading) return;

        this.setState({
            loading: true,
        });

        try {
            await ApiAxios.get('auth/logout');
        } catch (e) {
            console.log(e.response.data);
        }

        console.log('setting state')
        this.setState({
            loading: false,
        });
        console.log('pushing history')
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