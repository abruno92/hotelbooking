import React, { Profiler } from 'react'

export const Profile = () => {
    return (
        <div>            
            <div className = "ProfilePage">
                <div className="flex border">
                    <div
                        style={{
                        backgroundSize: "cover",
                        height: "200px",
                        width: "200px"
                    }}
                        className="border border-blue-300"
                    ></div>
                    <div className = "Name&Mail">
                        <h2 className = "Name">Antonia</h2>
                        <h3 className = "Mail">Antonia@gmail.com</h3>
                    </div>
                </div>
                        <button className = "SignOut">Sign out</button>
            </div>
        </div>
    );
}

export default Profile;