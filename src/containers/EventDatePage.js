import React, { Component } from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
import { DatePicker, Button, Card } from "antd";
import moment from "moment";

import { WrappedLink } from "../components/Common";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setEventDate } from "../actions/eventDate";

const RangePicker = DatePicker.RangePicker;
const dateFormat = "MM/DD/YYYY";

class EventDatePage extends Component {
  constructor(props) {
    super();
    this.state = { disableButton: true };
  }

  onChange = (dates, dateStrings) => {
    if (!this.props.isEventUpdated) {
      this.props.setEventDate(dateStrings, this.props.isUpdateEvent);
      if (this.props.onUpdateEditStatus)
        this.props.onUpdateEditStatus(dateStrings);
    }
  };

  setDateDefaultValue = () => {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    //console.log('here...', startDate);
    let defaultValue = [];
    if (startDate && endDate) {
      defaultValue = [
        moment(this.props.startDate, dateFormat),
        moment(this.props.endDate, dateFormat)
      ];
    }
    ////console.log('here...', defaultValue);
    return defaultValue;
  };

  render() {
    const defaultDateValue = this.setDateDefaultValue();
    return (
      <div>
        <Card title="Set Event Date">
          <RangePicker
            style={{ width: "100%" }}
            defaultValue={defaultDateValue}
            format={dateFormat}
            onChange={this.onChange}
          />
        </Card>
      </div>
    );
  }
}

const moveToNextPage = () => {};

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    eventDate: state.createEvent.eventDate,
    eventStartDate: state.createEvent.eventStartDate || null,
    evemtEndDate: state.createEvent.eventEndDate || null,
    prepareUpdateEvent: state.prepareUpdateEvent
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setEventDate: setEventDate }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDatePage);
