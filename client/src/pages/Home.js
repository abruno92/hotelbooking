import React from 'react'
import Banner from '../components/Banner';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';
import FeaturedRooms from '../components/FeaturedRooms';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

export default function Home() {
    return (
        <>
            <Navbar/>
            <Hero>
                <Banner title="Hotel Security" subtitle="Luxury rooms starting at £100">
                    <Link to='/rooms' className="btn-primary">
                        our rooms
                    </Link>
                </Banner>
            </Hero>
            <FeaturedRooms /> 
            <Reviews />
            <Footer/>
        </>
    )
}
