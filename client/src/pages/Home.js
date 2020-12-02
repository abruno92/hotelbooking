import React from 'react'
import Banner from '../components/Banner';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';
import FeaturedRooms from '../components/FeaturedRooms';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';
import ApiAxios from "../utils/ApiAxios";

export default function Home() {
    //todo remove
    async function handleClick() {
        await ApiAxios.get('booking/forUser');
    }

    return (
        <>
            <Navbar/>
            <Hero>
                <Banner title="Hotel Security" subtitle="Luxury rooms starting at £100">
                    <Link to='/rooms' className="btn-primary">
                        our rooms
                    </Link>
                    <button onClick={handleClick}>Click me</button>
                </Banner>
            </Hero>
            <FeaturedRooms /> 
            <Reviews />
            <Footer/>
        </>
    )
}
