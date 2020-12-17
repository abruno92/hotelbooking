import React from 'react'
import Bio from '../components/Bio';
import ProfilePicture from '../components/ProfilePicture';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {Subscription} from "rxjs";
import {AuthService} from "../services/auth";
import {BookingService} from "../services/booking";
import UserBookings from "../components/UserBookings";
import {RoomService} from "../services/room";
import UserContainer from "../components/UserContainer";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: AuthService.getUser(),
            bookings: BookingService.userBookingList$.getValue(),
        };
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(BookingService.userBookingList$.subscribe(async bookings => {
            const userBookings = await Promise.all(bookings.map(async booking => {
                const room = await RoomService.getRoom(booking.roomId);
                return {
                    id: booking._id,
                    name: room.name,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                }
            }));

            this.setState({
                user: this.state.user,
                bookings: userBookings,
            })
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
                <Hero hero="profileHero">
                    <div className="body">
                        <ProfilePicture userId={this.state.user._id}/>
                    </div>
                </Hero>
                <div className="services" style={{backgroundColor: "white"}}>
                    <Bio user={this.state.user}/>
                </div>
                <UserContainer userType='customer'>
                    <div className='services' style={{backgroundColor: "white"}}>
                        <UserBookings bookings={this.state.bookings}/>
                    </div>
                </UserContainer>
                <Footer/>
            </>
        )
    }
}
