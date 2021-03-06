import React from 'react';

/**
 * React component that presents the bookings of a single user
 * as a table.
 * @param bookings List of bookings to present.
 * @returns {JSX.Element}
 */
const UserBookings = ({bookings}) => {
    return (
        <>
            <div className="section-title">
                <h4>Bookings</h4>
                <div/>
            </div>
            <table style={{width: "100%"}}>
                <thead>
                <tr>
                    <th><h6>Name</h6></th>
                    <th><h6>Start Date</h6></th>
                    <th><h6>End Date</h6></th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(booking =>
                    !booking
                        ? null
                        : <tr key={booking.id}>
                            <td>{booking.name}</td>
                            <td>{new Date(booking.startDate).toUTCString()}</td>
                            <td>{new Date(booking.endDate).toUTCString()}</td>
                        </tr>)}
                </tbody>
            </table>
        </>
    )
}

export default UserBookings;