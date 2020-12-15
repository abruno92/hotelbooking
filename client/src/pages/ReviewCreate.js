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
import {Map} from 'immutable';
import {AuthService} from "../services/auth";
import {auditTime, tap} from "rxjs/operators";
import Button from "react-bootstrap/Button";
import {ReviewService} from "../services/review";

export default class ReviewCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.roomId,
            room: {},
            review: Map({
                userId: AuthService.getUser()._id,
                roomId: this.props.match.params.roomId,
                content: "",
            }),
            errors: Map({
                content: "",
            }),
        };

        this.loading$ = new BehaviorSubject(false);
        this.isDone$ = new BehaviorSubject(false);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    async handleSubmit() {
        try {
            await ReviewService.create(this.state.review.toObject());
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.errors);
                this.updateErrors(e.response.data.errors);
            } else {
                console.log(e);
            }
            return this.loading$.next(false);
        }

        this.isDone$.next(true);

        setTimeout(() => this.props.history.push(`/rooms/${this.state.id}`), 1000);
    }

    handleChange(e) {
        this.setState({
            review: this.state.review.set(e.target.name, e.target.value),
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
            review: this.state.review,
            errors: stateErrors,
        });
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        const submitReview$ = fromEvent(
            document.getElementById("submitReviewButton"),
            'click'
        ).pipe(
            tap(_ => this.loading$.next(true)),
            tap(click => click.preventDefault()),
            auditTime(200),
        )

        this.subscriptions.add(submitReview$.subscribe(async () => await this.handleSubmit()));
        this.subscriptions.add(this.loading$.subscribe(_ => this.forceUpdate()));
        this.subscriptions.add(RoomService.roomList$.subscribe(async rooms => {
            if (rooms.length > 0) {
                const room = await RoomService.getRoom(this.state.id);
                this.setState({
                    id: this.state.id,
                    room,
                    review: this.state.review,
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
                    <Banner title={`Review for ${this.state.room.name}`}>
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
                            <h6>Price: £{this.state.room.price}</h6>
                        </article>
                        <article className="info">
                            <span><h6>Your Review: <p style={{color: 'red'}}>{this.state.errors.get('content')}</p>
                            </h6></span>
                            <textarea name='content'
                                      id='content'
                                      placeholder='Review'
                                      onChange={this.handleChange}/>
                        </article>
                    </div>
                    <Button id="submitReviewButton" to='/' className="btn-primary"
                            disabled={this.isDone$.getValue() || this.loading$.getValue()}>{this.isDone$.getValue() ? "Review Submitted!" : this.loading$.getValue() ? "Loading..." : "Submit Review"}
                    </Button>
                </section>
                <Footer/>
            </>
        );
    }
}