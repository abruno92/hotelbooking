import React from "react";
import replyImage from "../images/reply.svg";
import Button from "react-bootstrap/Button";

/**
 * React component that contains a reply icon with the text "Reply".
 * @param onClick Callback executed when the button is clicked.
 * @returns {JSX.Element}
 */
export default function ReplyButton({onClick}) {
    return (
        <Button onClick={onClick}>
            <img style={{width: "20px", height: "20px"}} src={replyImage} alt=""/>
            Reply
        </Button>
    );
}