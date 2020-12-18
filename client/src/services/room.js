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

    constructor() {
        this.roomList$ = new BehaviorSubject([]);
        this.allRoomList$ = new BehaviorSubject([]);
        this.featuredRoomList$ = this.roomList$.pipe(map(rooms => getFeaturedRooms(rooms)));
    }

    /**
     * Attempts to refresh the lists of rooms.
     * @returns {Promise<string>}
     */
    async refreshList() {
        // retrieve the rooms currently not booked
        let availableRooms;
        try {
            availableRooms = (await ApiAxios.get('room')).data;
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
            } else {
                console.log(e);
            }
            return "";
        }

        // emit the rooms to the observable
        this.roomList$.next(availableRooms);

        // retrieve all the rooms
        let allRooms;
        try {
            allRooms = (await ApiAxios.get('room/all')).data;
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
            } else {
                console.log(e);
            }
            return "";
        }

        // emit the rooms to the observable
        this.allRoomList$.next(allRooms);
    }

    /**
     * Refreshes the list of rooms and retrieves a room.
     * @param id Id of the room to retrieve.
     * @returns {{}|undefined} Room object if found, undefined otherwise.
     */
    async getRoom(id) {
        await this.refreshList();
        return this.getRoomSync(id);
    }

    /**
     * Retrieves a room locally.
     * @param id Id of the room to retrieve.
     * @returns {{}|undefined} Room object if found, undefined otherwise.
     */
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