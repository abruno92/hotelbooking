import React from "react";
import Room from "./Room";

const RoomList = ({rooms}) => {
    if (rooms.length === 0) {
        return (
            <div className="empty-search">
                <h3>No Rooms available</h3>
            </div>
        );
    }
    return (
        <section className="roomslist">
            <div className="roomslist-center">
                {rooms.map(room => {
                    return <Room key={room._id} room={room}/>;
                })}
            </div>
        </section>
    );
};

export default RoomList;