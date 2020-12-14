import React, {Component} from 'react';
import {RoomContext} from '../Context';
import Room from './Room';
import Title from './Title';
import {Subscription} from "rxjs";
import {RoomService} from "../services/rooms";

export default class FeaturedRooms extends Component {
    static contextType = RoomContext;

    constructor(props) {
        super(props);
        this.state = {
            featuredRooms: [],
        }
    }

    componentDidMount() {
        this.subscriptions = new Subscription();

        this.subscriptions.add(RoomService.featuredRoomList$.subscribe(featuredRooms => {
            this.setState({featuredRooms});
        }));

        RoomService.refreshList();
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <section className="featured-rooms">
                <Title title="featured rooms"/>
                <div className="featured-rooms-center">
                    {this.state.featuredRooms.map(room => {
                        if (!room) return <></>;
                        return <Room key={room._id} room={room}/>
                    })}
                </div>
            </section>
        );
    }
}