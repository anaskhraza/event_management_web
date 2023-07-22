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
  Select,
  Checkbox
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { fetchCategorys } from "../actions/categories";

import {
  fetchItems,
  updateData,
  updateSelectedRowKeys,
  updateItemsDate,
  fetchUpdatedQuantity
} from "../actions/eventItem";

import OrderItemPage from "./OrderItemPage";
import OrderCostPage from "./OrderCostPage";
import { EditableCell, EditableFormRow } from "../components/TableComponent";
import { ColumnButton } from "../components/Common";

const RangePicker = DatePicker.RangePicker;
const dateFormat = "MM/DD/YYYY";
class EventItemPage extends Component {
  constructor(props) {
    super();
    this.state = {
      disableButton: true,
      selectedRowKeys: [],
      searchText: "",
      showDatePickerModal: false,
      eventDate: "",
      eventDateStart: "",
      searchCategory: "name",
      eventDateEnd: "",
      filterInfo: "",
      dateChangedProductId: "",
      dateChangedProductName: "",
      isOkDisable: true
    };
  }

  handleSearch = (selectedKeys, confirm) => {
    console.log("selectedKeys -> ", selectedKeys);
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "", filterInfo: "" });
  };

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
            console.log("node -> ", node);
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            this.setState({ filterInfo: e.target.value });
          }}
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
    filteredValue: [this.state.filterInfo],
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
        textToHighlight={text.toString()}
      />
    )
  });

  componentDidMount() {
    let isDuplicate = false;
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    const isEventUpdate = this.props.isEventUpdate;
    let orderId = this.props.orderId;
    let draftId = this.props.draftId;
    const duplicateOrderId = this.props.duplicateOrderId;
    console.log(" componentDidMount ", this.props);
    if (duplicateOrderId) {
      isDuplicate = true;
      orderId = duplicateOrderId;
      draftId = "";
    }

    let itemsPromise = this.props.fetchItems(
      { startDate, endDate },
      isEventUpdate,
      orderId,
      draftId,
      isDuplicate,
      this.props.dateItemsUpdate
    );
    let itemsPromise1 = this.props.fetchCategorys();
  }

  onSelectChange = selectedRowKeys => {
    ////console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.updateSelectedRowKeys(selectedRowKeys, this.props.itemData);
  };

  handleSave = row => {
    const newData = [...this.props.itemData];
    ////console.log('newData  ', newData);
    // debugger;
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });

    let x = newData;
    ////console.log('new Data CHanged', x);
    this.props.updateData(newData);
    this.props.updateSelectedRowKeys(this.props.selectedRowKeys, newData);
    // this.setState({ dataSource: newData });
  };

  updateModifiedItemQty = () => {
    this.props.fetchUpdatedQuantity(
      this.props.orderedData,
      this.props.modifiedItems
    );
    this.setState({
      isOkDisable: false
    });
  };

  ///////////////MOdal ///////////////////////

  toggleDatePickerModal = (record, e) => {
    //console.log("toggleDatePickerModal -> record ", record);
    this.setState({
      showDatePickerModal: true,
      eventDate: record.eventDate,
      eventDateStart: record.event_booking_start,
      eventDateEnd: record.event_booking_end,
      dateChangedProductId: record.id,
      dateChangedProductName: record.name
    });
  };

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      showDatePickerModal: false,
      eventDate: "",
      eventDateStart: "",
      eventDateEnd: "",
      dateChangedProductId: "",
      dateChangedProductName: ""
    });
  };

  onDateChange = (dates, dateStrings) => {
    //console.log("dates: ", dates);
    //console.log("dateStrings: ", dateStrings);
    this.setState({
      eventDate: `${dateStrings[0]} ${dateStrings[1]}`,
      eventDateStart: dateStrings[0],
      eventDateEnd: dateStrings[1]
    });
  };

  handleDateChange = e => {
    let obj = {
      id: this.state.dateChangedProductId,
      eventDate: this.state.eventDate,
      eventDateStart: this.state.eventDateStart,
      eventDateEnd: this.state.eventDateEnd
    };

    this.props.updateItemsDate(obj, this.props.itemData);

    this.setState({ showDatePickerModal: false });
  };

  DatePickerModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Recieve Money"
          visible={this.state.showDatePickerModal}
          footer={[
            <Button
              key="recievepayment"
              onClick={this.handleDateChange}
              type="danger"
            >
              OK
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          <RangePicker
            defaultValue={[
              moment(this.state.eventDateStart, dateFormat),
              moment(this.state.eventDateEnd, dateFormat)
            ]}
            format={dateFormat}
            onChange={this.onDateChange}
          />
        </Modal>
      </React.Fragment>
    );
  };

  //////////////////Modal////////////////////////////////

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        sorter: (a, b) => {
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        },
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("name")
      },
      {
        title: "Category",
        dataIndex: "Category.category_name",
        width: "10%"
      },
      {
        title: "Rate",
        dataIndex: "rate",
        width: "5%"
      },
      {
        title: "Price",
        dataIndex: "price",
        width: "5%"
      },
      {
        title: "Quantity Remaining",
        dataIndex: "quantity",
        sorter: (a, b) => a.quantity - b.quantity,
        sortDirections: ["descend", "ascend"],
        width: "10%"
      },
      {
        title: "Quantity Ordered",
        dataIndex: "quantity_ordered",
        width: "10%",
        editable: true
      },
      {
        title: "Event Date",
        dataIndex: "eventDate",
        width: "20%",
        render: (text, record) => (
          <ColumnButton
            title={record.eventDate}
            record={record}
            id={"dateevent"}
            type={"normal"}
            handleClick={this.toggleDatePickerModal}
          />
        )
      },
      {
        title: "No Of Days",
        dataIndex: "no_of_days",
        width: "10%"
      }
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const selectAfter = (
      <Select
        defaultValue="name"
        onChange={e => {
          console.log("values ", e);
          this.setState({ searchCategory: e });
        }}
        style={{ width: 100 }}
      >
        <Select.Option value="category">Category</Select.Option>
        <Select.Option value="name">Name</Select.Option>
        <Select.Option value="sku">Sku</Select.Option>
      </Select>
    );

    const columns1 = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    // debugger;
    const selectedRowKeys = this.props.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <Card
          title="Select Items"
          style={{ width: "100%", height: "auto", maxHeight: 700 }}
        >
          <div style={{ marginBottom: 16 }}>
            <Input
              addonAfter={selectAfter}
              defaultValue=""
              onChange={e => {
                this.searchInput = e;

                this.setState({ filterInfo: e.target.value });

                this.props.orderedData[this.state.searchCategory]
                  ? this.props.orderedData[this.state.searchCategory]
                      .toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  : "";
              }}
            />
          </div>
          <div style={{ paddingLeft: 10, paddingBottom: 10 }}>
            <Button
              type="danger"
              size={"large"}
              onClick={() => {
                this.onSelectChange([]);
              }}
            >
              Uncheck All Items
            </Button>
          </div>
          <Table
            components={components}
            rowSelection={rowSelection}
            rowClassName={() => "editable-row"}
            columns={columns1}
            dataSource={this.props.itemData}
            rowkey="id"
            scroll={{ y: 400 }}
          />
        </Card>
        <this.DatePickerModal />
        <OrderItemPage
          orderCost={this.props.orderCost}
          itemData={this.props.orderedData}
          confirmButtonLoading={this.props.fetchingUpdatedQuantity}
          onOkay={this.props.onOkay}
          disableOk={this.state.isOkDisable}
          updateModifiedItemQty={this.updateModifiedItemQty}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  ////console.log('here Create Event Page', state);
  return {
    categories: state.categories ? state.categories.data : [],
    startDate: state.createEvent ? state.createEvent.eventStartDate : "",
    endDate: state.createEvent ? state.createEvent.eventEndDate : "",
    isEventUpdate: state.prepareUpdateEvent.isEventUpdate,
    itemData: state.eventItems ? state.eventItems.data : [],
    orderedData: state.eventItems.orderedData
      ? state.eventItems.orderedData
      : [],
    orderId: state.prepareUpdateEvent.orderDetail
      ? state.prepareUpdateEvent.orderDetail.id
      : null,
    modifiedItems: state.eventItems.modifiedItems
      ? state.eventItems.modifiedItems
      : [],
    selectedRowKeys: state.eventItems ? state.eventItems.selectedRowKeys : [],
    fetching: state.eventItems ? state.eventItems.fetching : false,
    diableOkButton: state.eventItems.diableOkButton
      ? state.eventItems.diableOkButton
      : true,
    fetchingUpdatedQuantity: state.eventItems.fetchingUpdatedQuantity
      ? state.eventItems.fetchingUpdatedQuantity
      : false,
    orderCost: state.eventItems ? state.eventItems.orderCost : 0
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchItems: fetchItems,
      fetchCategorys: fetchCategorys,
      updateData: updateData,
      updateSelectedRowKeys: updateSelectedRowKeys,
      fetchUpdatedQuantity: fetchUpdatedQuantity,
      updateItemsDate
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EventItemPage);
