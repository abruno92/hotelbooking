import React from "react";
import { withRoomConsumer } from "../Context";
import Loading from "./Loading";
import RoomList from "./RoomList";

function RoomContainer({ context }) {
  const { loading, sortedRooms, rooms } = context;
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <RoomList rooms={sortedRooms} />
    </>
  );
}

export default withRoomConsumer(RoomContainer);
