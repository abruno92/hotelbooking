import React from 'react';

const Bio = ({user}) => {
    return (
        <>
            <div className="section-title">
                <h4>{user.privilegeLevel} Info</h4>
                <div/>
            </div>
            <h6 dangerouslySetInnerHTML={{__html: `Name: ${user.firstName} ${user.lastName}`}}/>
            <h6 dangerouslySetInnerHTML={{__html: `Email: ${user.email}`}}/>
        </>
    )
}

export default Bio;