import ApiAxios from "../utils/ApiAxios";
import {BehaviorSubject} from "rxjs";
import config from "../config";
import {map} from 'rxjs/operators';

/**
 * A Service responsible for managing the rooms of the app,
 * as well as their respective reviews and replies.
 */
class RoomServiceImpl {
    // Observable that emits a list of available rooms
    roomList$;
    // Observable that emits a list of all rooms
    allRoomList$;
    // Observable that emits a list of featured rooms
    featuredRoomList$;
    // Observable that emits whether or not a retrieval of rooms is currently pending
    fetchPending$;

    constructor() {
        this.roomList$ = new BehaviorSubject([]);
        this.allRoomList$ = new BehaviorSubject([]);
        this.featuredRoomList$ = this.roomList$.pipe(map(rooms => getFeaturedRooms(rooms)));
        this.fetchPending$ = new BehaviorSubject(true);
    }

    async refreshList() {
        let availableRooms;
        try {
            availableRooms = (await ApiAxios.get('room')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.roomList$.next(availableRooms);

        let allRooms;
        try {
            allRooms = (await ApiAxios.get('room/all')).data;
        } catch (e) {
            console.log(e.response.status);
            return "";
        }

        this.allRoomList$.next(allRooms);
    }

    async getRoom(id) {
        await this.refreshList();
        return this.getRoomSync(id);
    }

    getRoomSync(id) {
        return this.allRoomList$.getValue().find(room => room._id === id);
    }
}

/**
 * Returns a list of featured (random) rooms. The amount of rooms is based
 * on the config property 'config.rooms.featuredRoomsCount'.
 * @returns {[]} List of featured rooms
 */
function getFeaturedRooms(rooms) {
    const featuredRooms = [];

    const featuredRoomsCount = Math.min(config.rooms.featuredRoomsCount, rooms.length);

    do {
        const randomIndex = Math.floor(Math.random() * (rooms.length - 1) + 0.5);

        const room = rooms[randomIndex];

        if (featuredRooms.includes(room)) continue;

        featuredRooms.push(room);
    } while (featuredRooms.length < featuredRoomsCount);

    return featuredRooms;
}

export const RoomService = new RoomServiceImpl();