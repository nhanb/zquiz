import rpc from "./rpc.js";

let loadingQuizzes = true;
let quizzes = [];

function createRoomWithQuiz(quizId) {
  rpc.createRoom({}, (data) => {
    m.route.set(`/room/${data.roomId}`);
    m.redraw();
  });
}

const HomeRoute = {
  oninit: (vnode) => {
    if (quizzes.length > 0) {
      return;
    }

    loadingQuizzes = true;
    rpc.getQuizzes({}, (data) => {
      quizzes = data.quizzes;
      loadingQuizzes = false;
      m.redraw();
    });
  },
  view: (vnode) => {
    if (loadingQuizzes) {
      return m("h1", "Loading quizzes...");
    }
    return [
      m("h1", "Pick a quiz!"),
      m(
        "ul",
        quizzes.map((quiz) =>
          m(
            "li",
            m(
              "a",
              {
                href: "#",
                onclick: () => {
                  createRoomWithQuiz(quiz.id);
                },
              },
              quiz.name,
            ),
          ),
        ),
      ),
    ];
  },
};

export default HomeRoute;
