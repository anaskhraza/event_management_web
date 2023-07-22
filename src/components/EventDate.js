// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import { DatePicker } from 'antd';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;

type Props = {
  datePicker: string
};

function onChange(dates, dateStrings) {
  ////console.log('From: ', dates[0], ', to: ', dates[1]);
  ////console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  this.props.setEventDate(dateStrings);
}

export default class EventDate extends Component<Props> {
  props: Props;

  render() {
    ////console.log('props', this.props);
    const { datePicker } = this.props;
    return (
      <div>
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')]
          }}
          format="DD/MM/YYYY"
          onChange={onChange}
        />
      </div>
    );
  }
}
