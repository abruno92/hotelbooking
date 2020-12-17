import React, {memo} from "react";
import defaultImg from "../images/room-1.jpg";
import PropTypes from "prop-types";
import Reply from "./Reply";
import ReplyButton from "./ReplyButton";
import {useHistory} from "react-router-dom";

const Review = memo(({review}) => {
    const history = useHistory({});

    const {_id, userName, content, room} = review;

    return (
        <article className="room">
            <div className="img-container">
                <img src={defaultImg} alt="single room"/>
                <div className="price-top">
                    <h6 dangerouslySetInnerHTML={{__html: userName}}/>
                    <h6>{room.name}</h6>
                    <h6 dangerouslySetInnerHTML={{__html: content}}/>
                </div>
            </div>
            {review.reply ? <Reply reply={review.reply}/> : <ReplyButton onClick={() => {
                history.push(`/reply/${_id}`);
            }}/>}
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