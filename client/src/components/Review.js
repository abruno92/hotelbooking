import React, {memo} from "react";
import defaultImg from "../images/room-1.jpg";
import PropTypes from "prop-types";
import Reply from "./Reply";

const Review = memo(({review}) => {
    const {userName, content, room} = review;
    return (
        <article className="room">
            <div className="img-container">
                <img src={defaultImg} alt="single room"/>
                <div className="price-top">
                    <h6>{userName}</h6>
                    <h6>{room.name}</h6>
                    <h6>{content}</h6>
                </div>
                {review.reply ? <Reply reply={review.reply}/> : <></>}
            </div>
        </article>
    );
});

Review.propTypes = {
    review: PropTypes.shape({
        room: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        reply: PropTypes.shape({
            userName: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
        }),
        userName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
    })
};

export default Review;