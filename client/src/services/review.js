import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";
import {RoomService} from "./room";
import {UserService} from "./user";

/**
 * A Service responsible for managing the reviews and replies of a room.
 */
class ReviewServiceImpl {
    // Observable that emits a list of reviews of all rooms
    reviewList$;

    constructor() {
        this.reviewList$ = new BehaviorSubject([]);
    }

    /**
     * Attempts to refresh the list of reviews.
     */
    async refreshList() {
        // retrieve the reviews for all the rooms
        let reviews;
        try {
            reviews = (await ApiAxios.get('review')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        // add various attributes to the object of every review
        reviews = await Promise.all(reviews.map(async review => {
            // add the user name of the reviewer
            review.userName = await UserService.getNameForUser(review.userId);

            // retrieve the room referenced by the review
            const room = RoomService.getRoomSync(review.roomId);
            // add the room as an attribute, or a fallback room with an empty room if
            // no room was found
            review.room = room || {name: ""};

            try {
                // add the reply to the review
                review.reply = (await ApiAxios.get(`review/${review._id}/reply`)).data;
            } catch (e) {
                if (!(e.response.status === 404)) {
                    console.log(e);
                }
            }

            if (review.reply) {
                console.log('get replier name');
                // if the review has a reply, add the user name of the replier to the reply
                review.reply.userName = await UserService.getNameForUser(review.reply.userId);
            }

            return review;
        }));

        // emit the reviews to the observable
        this.reviewList$.next(reviews);
    }

    /**
     * Creates a new review in the database.
     * @param review Review object to create.
     */
    async create(review) {
        try {
            await ApiAxios.post('review', review);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        await ReviewService.refreshList();
    }

    /**
     * Creates a reply for an existing review in the database.
     * @param reviewId Id of the target review.
     * @param reply Reply object to create.
     */
    async createReply(reviewId, reply) {
        try {
            await ApiAxios.post(`review/${reviewId}/reply`, reply);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        await ReviewService.refreshList();
    }

    /**
     * Refreshes the list of reviews and retrieves a review.
     * @param id Id of the review to retrieve.
     * @returns {{}|undefined} Review object if found, undefined otherwise.
     */
    async getReview(id) {
        await this.refreshList();
        return this.getReviewSync(id);
    }

    /**
     * Retrieves a review locally.
     * @param id Id of the review to retrieve.
     * @returns {{}|undefined} Review object if found, undefined otherwise.
     */
    getReviewSync(id) {
        return this.reviewList$.getValue().find(review => review._id === id);
    }
}

export const ReviewService = new ReviewServiceImpl();