import React, {memo} from "react";
import {Link} from "react-router-dom";
import defaultImg from "../images/room-1.jpg";
import PropTypes from "prop-types";

const Room = memo(({room}) => {
    const {name, _id, price} = room;
    return (
        <article className="room">
            <div className="img-container">
                <img src={defaultImg} alt="single room"/>
                <div className="price-top">
                    <h6>£{price}</h6>
                </div>
                <Link to={`/rooms/${_id}`} className="btn-primary room-link">
                    View More
                </Link>
            </div>
            <p className="room-info">{name}</p>
        </article>
    );
});

Room.propTypes = {
    room: PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })
};

export default Room;