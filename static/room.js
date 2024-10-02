const RoomRoute = {
  view: (vnode) => {
    return m("h1", "Room " + vnode.attrs.id);
  },
};

export default RoomRoute;
