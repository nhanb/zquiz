import rpc from "./rpc.js";

let loadingQuizzes = true;
let quizzes = [];

const CreateQuizLink = {
  view: ({ attrs }) =>
    m(
      "a",
      {
        href: "#",
        onclick: () => {
          rpc.createRoom({ quizId: attrs.quiz.id }, (data) => {
            m.route.set(`/room/${data.roomId}`);
            m.redraw();
          });
        },
      },
      attrs.quiz.name,
    ),
};

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
    return m("main", [
      m("h1", "Pick a quiz!"),
      m(
        "ul",
        quizzes.map((quiz) => m("li", m(CreateQuizLink, { quiz: quiz }))),
      ),
    ]);
  },
};

export default HomeRoute;
