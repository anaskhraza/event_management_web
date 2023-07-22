import React, { Component } from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
import { Modal, DatePicker, Button, Card } from "antd";
import moment from "moment";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setEventDate } from "../actions/eventDate";
import { fetchItems } from "../actions/eventItem";
import EventItemPage from "./EventItemPage";

const RangePicker = DatePicker.RangePicker;
const dateFormat = "MM/DD/YYYY";

class OrderCostPage extends Component {
  constructor(props) {
    super();
    this.state = { disableButton: true, isShow: false };
  }

  onChange = (dates, dateStrings) => {
    this.props.setEventDate(dateStrings);
    this.setState({
      disableButton: false
    });
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  handleOk = e => {
    ////console.log(e);
    this.props.afterClose();
    this.props.enableCustomerInfo();
    this.setState({
      isShow: false
    });
  };

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      isShow: false
    });
    this.props.afterClose();
  };

  dismiss = () => {
    this.setState({
      isShow: false
    });
    this.props.afterClose();
    this.props.enableCustomerInfo();
  };

  componentDidMount() {
    // let itemsPromise = this.props.fetchItems();
  }

  render() {
    const disableDate = this.props.disableDate;
    let enableDate =
      this.props.disableItemsButton ||
      (!this.props.isEventUpdate && !this.props.startDate);
    if (disableDate) enableDate = disableDate ? false : true;
    return (
      <div>
        <Button
          type="primary"
          onClick={this.showModal}
          disabled={enableDate}
          style={{ width: "100%", marginTop: 10, right: 0, zIndex: 100 }}
        >
          Update Items For Order
        </Button>
        <Modal
          width="100%"
          height="100%"
          style={{ width: "100%", height: "100%" }}
          title="Basic Modal"
          visible={this.state.isShow}
          footer={null}
          onCancel={this.handleCancel}
        >
          <EventItemPage
            draftId={this.props.draftId}
            duplicateOrderId={this.props.duplicateOrderId}
            onOkay={this.dismiss}
            dateItemsUpdate={this.props.dateItemsUpdate}
          />
        </Modal>
      </div>
    );
  }
}

const moveToNextPage = () => {};

function mapStateToProps(state) {
  return {
    startDate: state.createEvent ? state.createEvent.eventStartDate : ""
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchItems: fetchItems }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCostPage);
