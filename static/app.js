import rpc from "./rpc.js";
import RoomRoute from "./room.js";
import HomeRoute from "./home.js";

rpc.onRpcReady(() => {
  const root = document.body;

  m.route.prefix = "";
  m.route(root, "/", {
    "/": HomeRoute,
    "/room/:id": RoomRoute,
  });
});
