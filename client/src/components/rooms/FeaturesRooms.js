import React, { Component } from 'react';
import { RoomContext } from '../../Context';
import Loading from '../layout/Loading';
import Room from './Room';
import Title from '../layout/Title';

export default class FeaturesRooms extends Component {
    static contextType = RoomContext;

    render() {
        let { Loading, featuredRooms: rooms } = this.context;
        rooms = rooms.map(room => {
            return <Room key={room.id} room={rooms}/>
        })

        return (
            <section>
                <Title title="Featured Rooms" />
                <div>
                    {Loading?<Loading/>:rooms}
                </div>
            </section>
        )
    }
}
