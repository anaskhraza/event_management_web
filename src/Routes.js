import React from "react";
import { Switch, Route } from "react-router";
import routes from "./constants/routes";
import App from "./containers/App";
import HomePage from "./containers/HomePage";
import CounterPage from "./containers/CounterPage";
import EventDatePage from "./containers/EventDatePage";
import EventItemPage from "./containers/EventItemPage";
import OrderCustomerPage from "./containers/OrderCustomerPage";
import OrderDraftPage from "./containers/OrderDraftPage";
import OrderListPage from "./containers/OrderListPage";
import DraftListPage from "./containers/DraftListPage";
import ItemListPage from "./containers/ItemListPage";
import TargetListPage from "./containers/TargetListPage";
import CustomerListPage from "./containers/CustomerListPage";

export default () => (
  <App>
    <Switch>
      <Route path={routes.EVENTPAGE} component={OrderCustomerPage} />
      <Route path={routes.ORDERLISTPAGE} component={OrderListPage} />
      <Route path={routes.DRAFTLISTPAGE} component={DraftListPage} />
      <Route path={routes.ITEMLISTPAGE} component={ItemListPage} />
      <Route path={routes.EVENTITEMPAGE} component={EventItemPage} />
      <Route path={routes.ORDERCUSTOMERPAGE} component={OrderCustomerPage} />
      <Route path={routes.ORDERDRAFTPAGE} component={OrderDraftPage} />
      <Route path={routes.TARGETLISTPAGE} component={TargetListPage} />
      <Route path={routes.CUSTOMERLISTPAGE} component={CustomerListPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
