import RoomRoute from "./room.js";
import HomeRoute from "./home.js";

m.route.prefix = "";
m.route(document.body, "/", {
  "/": HomeRoute,
  "/room/:id": RoomRoute,
});
