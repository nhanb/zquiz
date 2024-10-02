import rpc from "./rpc.js";

let loadingQuizzes = true;
let quizzes = [];

const HomeRoute = {
  oninit: (vnode) => {
    if (quizzes.length > 0) {
      return;
    }

    loadingQuizzes = true;
    rpc.getQuizzes({}, (contents) => {
      quizzes = contents;
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
        quizzes.map((quiz) => {
          m("li", quiz);
        }),
      ),
    ];
  },
};

export default HomeRoute;
