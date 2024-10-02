const root = document.getElementById("app");

import RoomRoute from "./room.js";
import HomeRoute from "./home.js";

m.route.prefix = "";
m.route(root, "/", {
  "/": HomeRoute,
  "/room/:id": RoomRoute,
});
