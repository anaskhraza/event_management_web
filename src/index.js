import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "./containers/Root";
import { configureStore, history } from "./store/configureStore";
import "./app.global.css";
import { hot, setConfig } from 'react-hot-loader'

setConfig({
  showReactDomPatchNotification: false
})

const store = configureStore();

render(
  <>
    <Root store={store} history={history} />
  </>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/Root", () => {
    // eslint-disable-next-line global-require
    const NextRoot = require("./containers/Root").default;
    render(
      <>
        <NextRoot store={store} history={history} />
      </>,
      document.getElementById("root")
    );
  });
}
