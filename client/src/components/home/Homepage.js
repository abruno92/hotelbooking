import React from 'react';
import Hero from '../layout/Hero';
import Banner from '../layout/Banner';
import FeaturedRooms from '../rooms/FeaturesRooms';

const home = () => {  
  return (    
    <>
      <Banner title="Rooms" subtitle="Room"></Banner>
      <FeaturedRooms></FeaturedRooms>
    </>  
  );
};

export default home;
