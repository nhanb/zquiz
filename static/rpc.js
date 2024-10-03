const ACTION_GET_QUIZZES = "get_quizzes";
const ACTION_CREATE_ROOM = "create_room";

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8001");

// (De)serialization helpers
function sendSerialized(obj) {
  window.socket = socket;
  socket.send(JSON.stringify(obj));
}
function deserialize(str) {
  return JSON.parse(str);
}

const responseHandlers = {};

function registerRpcMethod(method) {
  return (params, responseHandler) => {
    const id = crypto.randomUUID();
    sendSerialized({ id: id, method: { [method]: { ...params } } });
    responseHandlers[id] = responseHandler;
  };
}

const getQuizzes = registerRpcMethod(ACTION_GET_QUIZZES);
const createRoom = registerRpcMethod(ACTION_CREATE_ROOM);

// Listen for messages, find matching handler, run once then unregister that
// handler.
socket.addEventListener("message", (event) => {
  const resp = deserialize(event.data);
  const handler = responseHandlers[resp.id];
  if (!handler) {
    return;
  }

  handler(resp.data);
  delete responseHandlers[resp.id];
});

function onRpcReady(callback) {
  socket.addEventListener("open", callback);
}

export default {
  onRpcReady,
  getQuizzes,
  createRoom,
};
