import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";
import {RoomService} from "./room";
import sleep from "../utils/time";
import {UserService} from "./user";

/**
 * A Service responsible for managing the rooms of the app,
 * as well as their respective reviews and replies.
 */
class ReviewServiceImpl {
    // Observable that emits a list of rooms
    reviewList$;

    constructor() {
        this.reviewList$ = new BehaviorSubject([]);
    }

    async refreshList() {
        let reviews;
        try {
            reviews = (await ApiAxios.get('review')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        reviews = await Promise.all(reviews.map(async review => {
            review.userName = await UserService.getNameForUser(review.userId);

            const room = await RoomService.getRoom(review.roomId);
            review.room = room || {name: ""};

            try {
                review.reply = (await ApiAxios.get(`review/${review._id}/reply`)).data;
            } catch (e) {
                if (!(e.response.status === 404)) {
                    console.log(e);
                }
            }

            if (review.reply) {
                review.reply.userName = "";
                try {
                    const replyUser = (await ApiAxios.get(`/user/${review.reply.userId}`)).data;
                    review.reply.userName = `${replyUser.firstName} ${replyUser.lastName}`;
                } catch (e) {
                    if (!(e.response.status === 404)) {
                        console.log(e);
                    }
                }
            }

            return review;
        }));

        this.reviewList$.next(reviews);
    }

    async create(review) {
        try {
            await ApiAxios.post('review', review);
            await sleep(300);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        await ReviewService.refreshList();
    }
}

export const ReviewService = new ReviewServiceImpl();