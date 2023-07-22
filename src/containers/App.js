// @flow
import * as React from "react";
import Sidebar from "../components/Sidebar";
type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <div>
          <Sidebar />
          <div style={{ padding: "1rem 1rem 1rem 16rem" }}>
            {this.props.children}
          </div>
        </div>
      </React.Fragment>
    );
    s;
  }
}
