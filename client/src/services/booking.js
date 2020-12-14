import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";
import sleep from "../utils/time";

/**
 * A Service responsible for managing the bookings of the app.
 */
class BookingServiceImpl {
    // Observable that emits a list of bookings
    userBookingList$;

    constructor() {
        this.userBookingList$ = new BehaviorSubject([]);
    }

    async refreshList() {
        let result;
        try {
            result = (await ApiAxios.get('booking/forUser')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.userBookingList$.next(result);
    }

    async create(booking) {
        booking.startDate = booking.startDate && booking.startDate.toJSON();
        booking.endDate = booking.endDate && booking.endDate.toJSON();

        try {
            await ApiAxios.post('booking', booking);
            await sleep(300);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }
    }
}

export const BookingService = new BookingServiceImpl();