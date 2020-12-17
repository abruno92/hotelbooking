import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";
import sleep from "../utils/time";

/**
 * A Service responsible for managing the bookings of the app.
 */
class BookingServiceImpl {
    // Observable that emits a list of bookings for the logged user
    userBookingList$;
    // Observable that emits a list of bookings for all users
    allBookingList$;

    constructor() {
        this.userBookingList$ = new BehaviorSubject([]);
        this.allBookingList$ = new BehaviorSubject([]);
    }

    async refreshList() {
        let userBookings;
        try {
            userBookings = (await ApiAxios.get('booking/forUser')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.userBookingList$.next(userBookings);

        let allBookings;
        try {
            allBookings = (await ApiAxios.get('booking')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.allBookingList$.next(allBookings);
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

        await BookingService.refreshList();
    }

    async delete(id) {
        try {
            await ApiAxios.delete(`booking/${id}`);
            await sleep(300);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        await BookingService.refreshList();
    }
}

export const BookingService = new BookingServiceImpl();