/**
 * Object that represents the reply of a user of type admin to a review.
 */
class Reply {
    _id;
    reviewId;
    userId;
    content;
}

module.exports = Reply;