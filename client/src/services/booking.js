import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";

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

    /**
     * Attempts to refresh the lists of bookings.
     */
    async refreshList() {
        // retrieve the bookings for the current user
        let userBookings;
        try {
            userBookings = (await ApiAxios.get('booking/forUser')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        // emit the bookings to the observable
        this.userBookingList$.next(userBookings);

        // retrieve all the bookings of the app
        let allBookings;
        try {
            allBookings = (await ApiAxios.get('booking')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        // emit the bookings to the observable
        this.allBookingList$.next(allBookings);
    }

    /**
     * Creates a new booking in the database.
     * @param booking Booking object to create.
     */
    async create(booking) {
        // convert dates to json format, if they exist
        booking.startDate = booking.startDate && booking.startDate.toJSON();
        booking.endDate = booking.endDate && booking.endDate.toJSON();

        try {
            await ApiAxios.post('booking', booking);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        // refresh the list with the new booking
        await BookingService.refreshList();
    }

    /**
     * Deletes a booking from the database.
     * @param id Id of the booking to delete.
     */
    async delete(id) {
        try {
            await ApiAxios.delete(`booking/${id}`);
        } catch (e) {
            if (e.response.status === 400) {
                throw e;
            } else {
                console.log(e);
            }
        }

        // refresh the list without the deleted booking
        await BookingService.refreshList();
    }
}

export const BookingService = new BookingServiceImpl();