import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import defaultBcg from '../images/room-1.jpg';
import Banner from "../components/Banner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {Link} from "react-router-dom";
import {BehaviorSubject, fromEvent, Subscription} from "rxjs";
import StyledHero from "../components/StyledHero";
import {Map} from 'immutable';
import {AuthService} from "../services/auth";
import {auditTime, tap} from "rxjs/operators";
import Button from "react-bootstrap/Button";
import {ReviewService} from "../services/review";

export default class ReplyCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.reviewId,
            review: {},
            reply: Map({
                userId: AuthService.getUser()._id,
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
            await ReviewService.createReply(this.state.id, this.state.reply.toObject());
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

        setTimeout(() => this.props.history.push('/'), 1000);
    }

    handleChange(e) {
        this.setState({
            reply: this.state.reply.set(e.target.name, e.target.value),
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
            review: this.state.review,
            reply: this.state.reply,
            errors: stateErrors,
        });
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        const submitReview$ = fromEvent(
            document.getElementById("submitReplyButton"),
            'click'
        ).pipe(
            tap(_ => this.loading$.next(true)),
            tap(click => click.preventDefault()),
            auditTime(200),
        )

        this.subscriptions.add(submitReview$.subscribe(async () => await this.handleSubmit()));
        this.subscriptions.add(this.loading$.subscribe(_ => this.forceUpdate()));
        this.subscriptions.add(ReviewService.reviewList$.subscribe(async reviews => {
            if (reviews.length > 0) {
                const review = await ReviewService.getReview(this.state.id);
                this.setState({
                    id: this.state.id,
                    review,
                    reply: this.state.reply,
                    errors: this.state.errors,
                });
            }
        }));
        console.log(this.state.review);
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <>
                <Navbar/>
                <StyledHero img={defaultBcg}>
                    <Banner title={this.state.review && `Review of ${this.state.review.room && this.state.review.room.name}`}>
                        <Link to={`/rooms/${this.props.match.params.roomId}`} className="btn-primary">
                            return to room page
                        </Link>
                    </Banner>
                </StyledHero>
                <section className="single-room">
                    <div className="single-room-info">
                        <article className="info">
                            <h6>Room: {this.state.review.room && this.state.review.room.name}</h6>
                        </article>
                        <article className="info">
                            <h6>By: {this.state.review.userName}</h6>
                        </article>
                        <article className="desc">
                            <p dangerouslySetInnerHTML={{__html: this.state.review.content}}/>
                        </article>
                        <article className="info">
                            <span><h6>Your Reply: <p style={{color: 'red'}}>{this.state.errors.get('content')}</p>
                            </h6></span>
                            <textarea name='content'
                                      id='content'
                                      placeholder='Reply'
                                      onChange={this.handleChange}/>
                        </article>
                    </div>
                    <Button id="submitReplyButton" to='/' className="btn-primary"
                            disabled={this.isDone$.getValue() || this.loading$.getValue()}>{this.isDone$.getValue() ? "Reply Submitted!" : this.loading$.getValue() ? "Loading..." : "Submit Reply"}
                    </Button>
                </section>
                <Footer/>
            </>
        );
    }
}