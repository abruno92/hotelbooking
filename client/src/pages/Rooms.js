import React from "react";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {Link} from "react-router-dom";
import RoomsList from "../components/RoomList";
import {Subscription} from "rxjs";
import {RoomService} from "../services/room";

class Rooms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
        };
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(RoomService.roomList$.subscribe(rooms => {
            this.setState({rooms});
        }));

        RoomService.refreshList();
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <>
                <Navbar/>
                <Hero hero="roomsHero">
                    <Banner title="our rooms">
                        <Link to="/" className="btn-primary">
                            return home
                        </Link>
                    </Banner>
                </Hero>
                <RoomsList rooms={this.state.rooms}/>
                <Footer/>
            </>
        );
    }
}

export default Rooms;