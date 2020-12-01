import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import defaultBcg from '../images/room-1.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StyledHero from '../components/StyledHero';
import Room from '../components/Room';
import Title from '../components/Title';
import Banner from '../components/Banner';

import { RoomContext } from '../Context';


export default class SingleRoom extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      slug: this.props.match.params.slug,
      defaultBcg: defaultBcg
    };
  }
  static contextType = RoomContext;

  render() {
    const { getRoom } = this.context;
    const room = getRoom(this.state.slug);

    if (!room) {
      return (
        <div className="error">
          <h3> oops broken link, no room was found.</h3>
          <Link to="/rooms" className="btn-primary">
            Back to Rooms
          </Link>
        </div>
      );
    }

    const {
      name,
      description,
      capacity,
      size,
      price,
      extras,
      breakfast,
      pets,
      images
    } = room;

    const [firstImage, ...allImages] = images;
    console.log(allImages);
    console.log('hi', name)

    return (
      <>
        <Navbar />
        <StyledHero img={firstImage}>
          <Banner title={name}>
            <Link to="/rooms" className="btn-primary">
                back to rooms
            </Link>
          </Banner>  
        </StyledHero>
        <section className="single-room">
          <div className="single-room-images">
            {allImages.map((item, index) => (
              <img key={index} src={item} alt={name} />
            ))}
          </div>
          <div className="single-room-info">
            <article className="desc">
              <h3>details</h3>
              <p>{description}</p>
            </article>
            <article className="info">
              <h3>Details</h3>
              <h6>price : £{price}</h6>
              <h6>
                max capacity :
                {capacity > 1 ? ` ${capacity} people` :  ` ${capacity} person`}
              </h6>
              <h6>{breakfast && "free breakfast included"}</h6>
            </article>
          </div>
        </section>
        <Footer />
      </>
    );
  }
}
