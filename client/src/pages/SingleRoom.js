import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import defaultBcg from '../images/room-1.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StyledHero from '../components/StyledHero';
import Banner from '../components/Banner';
import {RoomService} from "../services/rooms";
import {Subscription} from "rxjs";

export default class SingleRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            room: undefined,
        };
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(RoomService.roomList$.subscribe(rooms => {
            if (rooms.length > 0) {
                const room = RoomService.getRoom(this.state.id);
                this.setState({
                    id: this.state.id,
                    room
                });
            }
        }));

        RoomService.refreshList();
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        if (!this.state.room) {
            return (
                <div className="error">
                    <h3> oops broken link, no room was found.</h3>
                    <Link to="/rooms" className="btn-primary">
                        Back to Rooms
                    </Link>
                </div>
            );
        }

        return (
            <>
                <Navbar/>
                <StyledHero img={defaultBcg}>
                    <Banner title={this.state.room.name}>
                        <Link to="/rooms" className="btn-primary">
                            back to rooms
                        </Link>
                    </Banner>
                </StyledHero>
                <section className="single-room">
                    <div className="single-room-info">
                        <article className="desc">
                            <h3>Description</h3>
                            <p>{this.state.room.description}</p>
                        </article>
                        <article className="info">
                            <h3>Details</h3>
                            <h6>price : £{this.state.room.price}</h6>
                        </article>
                    </div>
                </section>
                <Footer/>
            </>
        );
    }
}
