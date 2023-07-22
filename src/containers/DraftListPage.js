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
  Switch,
  Menu,
  Dropdown
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SpinnerComponent } from "../utils/common";
import { fetchDrafts, deleteDraft } from "../actions/drafts";
import { createDraft } from "../actions/drafts";
import {
  ColumnDropDown,
  ColumnButtonDraft,
  ColumnButtonDraft1
} from "../components/Common";
import { setEventDate } from "../actions/eventDate";
class DraftListPage extends Component {
  constructor(props) {
    super();
    this.state = {
      order_no: "",
      db_balance_amount: 0,
      balance_amount: 0,
      received_amount: 0,
      total_amount: 0,
      db_received_amount: 0,
      isShow: false,
      disableOkButton: false,
      isOrderProcessModal: false,
      disabledCancelButton: false,
      isVoidModalShow: false,
      disableVoided: true,
      key: "",
      id: ""
    };
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  componentDidMount() {
    let itemsPromise = this.props.fetchDrafts();
  }

  handleClick = (record, key) => {
    switch (key) {
      case "edit": {
        const dateArray = record.event_date ? record.event_date.split(" ") : [];
        this.props.setEventDate(dateArray);
        break;
      }
      default: {
        break;
      }
    }
  };

  deleteDraft = (record, e) => {
    //console.log("record -> ", record);
    //console.log("e -> ", e);

    const draftId = record.id;

    this.props.deleteDraft(draftId, true);
  };

  render() {
    const columns = [
      {
        title: "Draft Number",
        dataIndex: "draft_no",
        width: "8%",
        ...this.getColumnSearchProps("draft_no")
      },
      {
        title: "customer Name",
        dataIndex: "draft_customer.customer_name",
        width: "8%",
        ...this.getColumnSearchProps("draft_customer.customer_name")
      },
      {
        title: "Draft Title",
        dataIndex: "draft_title",
        width: "10%",
        ...this.getColumnSearchProps("draft_title")
      },
      {
        title: "DATE",
        dataIndex: "event_date",
        width: "8%"
      },
      {
        title: "Total Amount",
        dataIndex: "total_amount",
        width: "8%"
      },
      {
        title: "Balance Amount",
        dataIndex: "balance_amount",
        width: "8%"
      },
      {
        title: "Edit",
        key: "edit",
        width: "10%",
        render: (text, record) => (
          <ColumnButtonDraft
            title={"draft"}
            record={record}
            id={"editAndCreateDraft"}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Convert to New Order/ Draft",
        key: "convert",
        width: "20%",
        render: (text, record) => (
          <ColumnButtonDraft1
            title={"draft"}
            record={record}
            id={"editAndCreateDraft"}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Delete",
        key: "delete",
        width: "8%",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to delete the draft"
            onConfirm={e => this.deleteDraft(record, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete Draft</Button>
            {/* <a href="#">Mark Complete</a> */}
          </Popconfirm>
        )
      }
    ];
    const itemCount = this.props.itemData ? this.props.itemData.length : 0;
    const count = `Draft Count: ${itemCount}`;

    return (
      <Card
        title="Draft List"
        extra={count}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 1200,
          textAlign: "center",
          alignContent: "center"
        }}
      >
        <Table
          columns={columns}
          dataSource={this.props.itemData}
          loading={this.props.fetching}
          scroll={{ y: 400 }}
        />
      </Card>
    );
  }
}

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    itemData: state.drafts ? state.drafts.data : [],
    fetching: state.drafts ? state.drafts.fetching : fasle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDrafts: fetchDrafts,
      deleteDraft: deleteDraft,
      setEventDate: setEventDate
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftListPage);
