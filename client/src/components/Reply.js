import React, {memo} from "react";
import PropTypes from "prop-types";

/**
 * React component that contains the reply to a review of a room.
 * @type {React.NamedExoticComponent<{readonly reply?: *}>}
 */
const Reply = memo(({reply}) => {
    const {userName, content} = reply;
    return (
        <article className="room">
            <div className="img-container">
                <div className="price-top">
                    <h6 dangerouslySetInnerHTML={{__html: userName}}/>
                    <h6 dangerouslySetInnerHTML={{__html: content}}/>
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