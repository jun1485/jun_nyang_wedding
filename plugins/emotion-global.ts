import { injectGlobal } from "@emotion/css";

let isInjected = false;

export default defineNuxtPlugin(() => {
  if (isInjected) return;

  injectGlobal`
    @import url("https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=block");

    :root {
      --petal-50: #fff9fb;
      --petal-100: #ffeef3;
      --petal-200: #ffdce5;
      --petal-300: #ffc3d3;
      --rose-500: #e75a84;
      --rose-600: #d53f6d;
      --text-main: #3f2a34;
      --text-sub: #715964;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body,
    #__nuxt {
      min-height: 100%;
    }

    body {
      margin: 0;
      font-family: "Gaegu", sans-serif;
      color: var(--text-main);
      background:
        radial-gradient(
          circle at 16% 8%,
          rgba(255, 220, 230, 0.55),
          rgba(255, 220, 230, 0) 42%
        ),
        radial-gradient(
          circle at 90% 0%,
          rgba(255, 239, 213, 0.5),
          rgba(255, 239, 213, 0) 45%
        ),
        linear-gradient(180deg, #fffdfd 0%, #fff8f7 50%, #fffdf9 100%);
    }

    html,
    body,
    button,
    input,
    select,
    textarea,
    a,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    span,
    div,
    li,
    label,
    strong,
    small {
      font-family: "Gaegu", sans-serif;
    }

    .wedding-no-scroll {
      overflow: hidden;
    }
  `;

  isInjected = true;
});
