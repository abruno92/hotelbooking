import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import defaultBcg from '../images/room-1.jpg';
import Banner from "../components/Banner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {Link} from "react-router-dom";
import {BehaviorSubject, fromEvent, Subscription} from "rxjs";
import {RoomService} from "../services/room";
import StyledHero from "../components/StyledHero";
import DatePicker from 'react-datepicker';
import {Map} from 'immutable';
import {AuthService} from "../services/auth";
import {auditTime, tap} from "rxjs/operators";
import {BookingService} from "../services/booking";
import Button from "react-bootstrap/Button";

export default class BookingCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.roomId,
            room: {},
            booking: Map({
                userId: AuthService.getUser()._id,
                roomId: this.props.match.params.roomId,
                price: 0,
                startDate: undefined,
                endDate: undefined,
            }),
            errors: Map({
                startDate: "",
                endDate: "",
            }),
        };

        this.loading$ = new BehaviorSubject(false);
        this.isDone$ = new BehaviorSubject(false);

        this.handleBook = this.handleBook.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    async handleBook() {
        try {
            await BookingService.create(this.state.booking.toObject());
        } catch (e) {
            console.log(e.response.data.errors);
            this.updateErrors(e.response.data.errors);
            return this.loading$.next(false);
        }

        this.isDone$.next(true);

        setTimeout(() => this.props.history.push(`/rooms/${this.state.id}`), 1000);
    }

    handleStartDateChange(date) {
        this.setState({
            id: this.state.id,
            room: this.state.room,
            booking: this.state.booking.set('startDate', date),
            errors: this.state.errors,
        });
    }

    handleEndDateChange(date) {
        this.setState({
            id: this.state.id,
            room: this.state.room,
            booking: this.state.booking.set('endDate', date),
            errors: this.state.errors,
        });
    }

    updateErrors(errors) {
        let stateErrors = this.state.errors.map((v, k) => {
            const error = errors.find(error => error.param === k);
            return error ? error.msg : "";
        });

        this.setState({
            id: this.state.id,
            room: this.state.room,
            booking: this.state.booking,
            errors: stateErrors,
        });
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        const finalizeBooking$ = fromEvent(
            document.getElementById("bookingButton"),
            'click'
        ).pipe(
            tap(_ => this.loading$.next(true)),
            tap(click => click.preventDefault()),
            auditTime(200),
        )

        this.subscriptions.add(finalizeBooking$.subscribe(async () => await this.handleBook()));
        this.subscriptions.add(this.loading$.subscribe(_ => this.forceUpdate()));
        this.subscriptions.add(RoomService.roomList$.subscribe(async rooms => {
            if (rooms.length > 0) {
                const room = await RoomService.getRoom(this.state.id);
                this.setState({
                    id: this.state.id,
                    room,
                    booking: this.state.booking.set('price', room.price),
                    errors: this.state.errors,
                });
            }
        }));
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <>
                <Navbar/>
                <StyledHero img={defaultBcg}>
                    <Banner title={`Booking for ${this.state.room.name}`}>
                        <Link to={`/rooms/${this.props.match.params.roomId}`} className="btn-primary">
                            return to room page
                        </Link>
                    </Banner>
                </StyledHero>
                <section className="single-room">
                    <div className="single-room-info">
                        <article className="desc">
                            <p>{this.state.room.description}</p>
                        </article>
                        <article className="info">
                            <h6>Price: £{this.state.booking.get('price')}</h6>
                        </article>
                        <article className="info">
                            <span><h6>Start date:
                                <DatePicker selected={this.state.booking.get('startDate')}
                                            onChange={this.handleStartDateChange}/>
                                <p style={{color: 'red'}}>{this.state.errors.get('startDate')}</p>
                            </h6></span>
                            <span><h6>End date:
                                <DatePicker selected={this.state.booking.get('endDate')}
                                            onChange={this.handleEndDateChange}/>
                                <p style={{color: 'red'}}>{this.state.errors.get('endDate')}</p>
                            </h6></span>
                        </article>
                    </div>
                    <Button id="bookingButton" to='/' className="btn-primary"
                            disabled={this.isDone$.getValue() || this.loading$.getValue()}>{this.isDone$.getValue() ? "Booking successful!" : this.loading$.getValue() ? "Loading..." : "Finalize Booking"}
                    </Button>
                </section>
                <Footer/>
            </>
        );
    }
}