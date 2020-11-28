import React, { Profiler } from 'react';
import Title from '../layout/Title';
import ProfileImage from './ProfileImage';

export const Profile = () => {
    return (
        <div className="App"> 
            <ProfileImage />        
            <Title />
        </div>
    )
}

export default Profile;