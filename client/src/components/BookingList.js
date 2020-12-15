import React from "react";
import Button from "react-bootstrap/Button";

const BookingList = ({bookings, onDelete}) => {
    if (bookings.length === 0) {
        return (
            <div className="empty-search">
                <h3>No Bookings available</h3>
            </div>
        );
    }
    return (
        <>
            <div className='section-title'>
                <h4>Bookings</h4>
                <div/>
            </div>
            <table style={{width: '100%'}}>
                <thead>
                <tr>
                    <th><h6>Room Name</h6></th>
                    <th><h6>Customer Name</h6></th>
                    <th><h6>Start Date</h6></th>
                    <th><h6>End Date</h6></th>
                    <th><h6>Actions</h6></th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(booking =>
                    !booking
                        ? null
                        : <tr key={booking.id}>
                            <td>{booking.roomName}</td>
                            <td>{booking.userName}</td>
                            <td>{booking.startDate}</td>
                            <td>{booking.endDate}</td>
                            <td><Button id={booking.id} className='btn-danger'
                                        onClick={onDelete}>Delete</Button></td>
                        </tr>
                )}
                </tbody>
            </table>
        </>
    );
}

export default BookingList;