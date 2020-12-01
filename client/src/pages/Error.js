import React from 'react'
import Banner from '../components/Banner';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <div>
            <Navbar />
            <Hero>
                <Banner title="Oops" subtitle="Page not found">
                    <Link to='/' className="btn-primary">
                        Back to home
                    </Link>
                </Banner>
            </Hero>
            <Footer />
        </div>
    )
}

