import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";

/**
 * A Service responsible for managing the rooms of the app,
 * as well as their respective reviews and replies.
 */
class RoomServiceImpl {
    // Observable that emits a list of rooms
    roomList$;
    // Observable that emits whether or not a retrieval of rooms is currently pending
    fetchPending$;

    constructor() {
        this.roomList$ = new BehaviorSubject([]);
        this.fetchPending$ = new BehaviorSubject(true);
    }

    async refreshList() {
        let result;
        try {
            result = (await ApiAxios.get('room')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.roomList$.next(result);
    }

    getRooms() {
        return this.roomList$.getValue();
    }
}

export const RoomService = new RoomServiceImpl();