import React, {memo} from "react";
import PropTypes from "prop-types";

const Reply = memo(({reply}) => {
    const {userName, content} = reply;
    return (
        <article className="room">
            <div className="img-container">
                <div className="price-top">
                    <h6>{userName}</h6>
                    <h6>{content}</h6>
                </div>
            </div>
        </article>
    );
});

Reply.propTypes = {
    reply: PropTypes.shape({
        userName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
    }),
};

export default Reply;