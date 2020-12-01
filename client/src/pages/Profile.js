import React from 'react'
import Bio from '../components/Bio';
import ProfileUploader from '../components/ProfileImg';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

export default function Home() {
    return (
        <>
            <Navbar/>
            <Hero hero="profileHero">
            <div className="body">         
                  <ProfileUploader />
            </div>      
            </Hero>
            <div className="services" style={{backgroundColor:"white"}}>
            <Bio />
            </div>
            <Footer/>
        </>
    )
}
