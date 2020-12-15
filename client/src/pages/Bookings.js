import React from 'react';
import {Subscription} from "rxjs";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import {Link} from "react-router-dom";
import Footer from "../components/Footer";
import {BookingService} from "../services/booking";
import BookingList from "../components/BookingList";
import {RoomService} from "../services/room";
import {UserService} from "../services/user";

export default class Bookings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    async handleDelete(e) {
        if(window.confirm(`Delete booking with id '${e.target.id}'?`)) {
            await BookingService.delete(e.target.id);
        }
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(BookingService.userBookingList$.subscribe(async bookings => {
            const userBookings = await Promise.all(bookings.map(async booking => {
                const room = await RoomService.getRoom(booking.roomId);
                const userName = await UserService.getNameForUser(booking.userId);
                return {
                    id: booking._id,
                    roomName: room.name,
                    userName: userName,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                }
            }));

            this.setState({bookings: userBookings});
        }));

        BookingService.refreshList();
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <>
                <Navbar/>
                <Hero hero="roomsHero">
                    <Banner title="User Bookings">
                        <Link to="/" className="btn-primary">
                            return home
                        </Link>
                    </Banner>
                </Hero>
                <BookingList bookings={this.state.bookings} onDelete={this.handleDelete}/>
                <Footer/>
            </>
        );
    }
}