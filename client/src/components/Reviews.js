import React from 'react';
import Title from './Title';
import {Subscription} from "rxjs";
import {ReviewService} from "../services/review";
import Review from "./Review";

/**
 * React component that contains a collection of reviews.
 */
export default class Reviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
        }
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(ReviewService.reviewList$.subscribe(reviews => {
            this.setState({reviews});
        }));

        ReviewService.refreshList();
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <section className='services'>
                <Title title={'Customer Reviews'}/>
                <div className="featured-rooms-center">
                    {this.state.reviews.map(review => {
                        if (!review) return <></>;
                        return <Review key={review._id} review={review}/>
                    })}
                </div>
            </section>
        )
    }
}
