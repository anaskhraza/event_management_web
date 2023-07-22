import React, { Component } from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
import {
  DatePicker,
  Button,
  Card,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Icon,
  Modal,
  Alert,
  Menu,
  Spin,
  Dropdown
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

export const SpinnerComponent = () => {
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  return <Spin indicator={antIcon} />;
};

export const AlertErrorFieldComponent = props => {
  const validateField = props.validateField;
  let additionalCondition = true;

  if (props.additionalCondition) {
    additionalCondition = props.additionalCondition;
  }

  let alertComponent = null;

  if (!validateField && additionalCondition) {
    alertComponent = (
      <Alert
        message="This is the required field"
        type="error"
        showIcon
        style={{ width: "65%", marginTop: "10px" }}
      />
    );
  }
  return alertComponent;
};

export const AlertCredentialsError = props => {
  let alertComponent = null;
  if (props.signInError) {
    return (
      <Alert
        message="Wrong Credentials"
        type="error"
        showIcon
        style={{ width: "65%", marginTop: "10px" }}
      />
    );
  }

  return alertComponent;
};

export const OrderSubmitButton = props => {
  const alertNoOfPerson = props.alertNoOfPerson;
  const alertPerHeadAmount = props.alertPerHeadAmount;
  const tabSelect = props.tabSelect;
  const alertBoxName = props.alertBoxName;
  const alertBoxNumber = props.alertBoxNumber;
  const alertBoxAddress = props.alertBoxAddress;
  const alertBoxLocationAddress = props.alertBoxLocationAddress;
  const orderTitle = props.orderTitle;
  const showModal = props.showModal;
  let enableButton = false;
  let buttonComponent = null;

  if (tabSelect) {
    if (
      alertNoOfPerson &&
      alertPerHeadAmount &&
      alertBoxName &&
      alertBoxNumber &&
      alertBoxAddress &&
      alertBoxLocationAddress &&
      orderTitle
    ) {
      enableButton = true;
    }
  } else {
    if (
      alertBoxName &&
      alertBoxNumber &&
      alertBoxAddress &&
      alertBoxLocationAddress &&
      orderTitle
    ) {
      enableButton = true;
    }
  }

  buttonComponent = (
    <React.Fragment>
      <Button
        type="primary"
        onClick={showModal}
        disabled={!enableButton}
        style={{ width: "100%", marginTop: "3%" }}
      >
        Save Order
      </Button>
    </React.Fragment>
  );

  return buttonComponent;
};

export const DraftSubmitButton = props => {
  const alertNoOfPerson = props.alertNoOfPerson;
  const alertPerHeadAmount = props.alertPerHeadAmount;
  const tabSelect = props.tabSelect;
  const alertBoxName = props.alertBoxName;
  const title = props.alertTitle;
  const alertBoxNumber = props.alertBoxNumber;
  const alertBoxAddress = props.alertBoxAddress;
  const showModal = props.showModal;
  let enableButton = false;
  let buttonComponent = null;

  if (tabSelect) {
    if (
      alertNoOfPerson &&
      alertPerHeadAmount &&
      alertBoxName &&
      alertBoxNumber &&
      alertBoxAddress &&
      title
    ) {
      enableButton = true;
    }
  } else {
    if (alertBoxName && alertBoxNumber && alertBoxAddress && title) {
      enableButton = true;
    }
  }

  buttonComponent = (
    <React.Fragment>
      <Button
        type="primary"
        onClick={showModal}
        disabled={!enableButton}
        style={{ width: "100%", marginTop: "3%" }}
      >
        Save Draft
      </Button>
    </React.Fragment>
  );

  return buttonComponent;
};

export const OrderFailureAlert = props => {
  return (
    <Alert
      message="Error"
      description={`This is an error while creating the ${props.tilte}`}
      type="error"
      showIcon
    />
  );
};

export const OrderSuccessAlert = props => {
  return (
    <Alert
      message="Success"
      description={`Order number: ${props.orderNo} successfully created with customer Name: ${props.customer}. Total Amount: ${props.totalAmount} and Balnce Amount:  ${props.dueAmount}. 
                  Date of Event is between ${props.eventDate}.`}
      type="success"
      showIcon
    />
  );
};
