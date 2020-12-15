import React from 'react';

const Bio = ({user}) => {

    return (
        <>
            <div className="section-title">
                <h4>{user.privilegeLevel} Info</h4>
                <div/>
            </div>
            <h6>Name: {user.firstName} {user.lastName}</h6>
            <h6>Email: {user.email}</h6>
        </>
    )
}

export default Bio;