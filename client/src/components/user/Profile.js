import React, { Profiler } from 'react'

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

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
                        <button className = "signOut">Sign out</button>
            </div>
        </div>
    );
}

export default Profile;