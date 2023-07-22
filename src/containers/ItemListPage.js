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
  Select,
  Switch,
  Menu,
  Dropdown
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SpinnerComponent } from "../utils/common";
import {
  fetchItems,
  deleteProducts,
  createProducts
} from "../actions/eventItem";
import {
  fetchCategorys,
  deleteCategory,
  createCategory
} from "../actions/categories";
import { ColumnDropDown, ColumnButton } from "../components/Common";
const { Option } = Select;
class ItemListPage extends Component {
  constructor(props) {
    super();
    this.state = {
      isAddItemModal: false,
      enableAddItem: false,
      enableAddCategory: false,
      isAddCategoryModal: false,
      isUpdateItem: false,
      itemId: "",
      categoryId: "",
      itemCategory: "",
      itemName: "",
      itemSKU: "",
      category: "",
      rate: 0,
      quantity: 0,
      categoryName: ""
    };
  }

  componentWillUnmount() {
    this.setState({
      enableAddItem: false,
      rate: 0,
      quantity: 0
    });
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
        textToHighlight={text.toString()}
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
    let itemsPromise = this.props.fetchItems();
    let itemsPromise1 = this.props.fetchCategorys();
  }

  handleClick = (record, e) => {
    //console.log("Rec -> ", record);
    const key = e.target ? e.target.id : e.key;
    //console.log("key -> ", key);

    switch (key) {
      case "editItem": {
        this.editItem(record);
        break;
      }
      case "editCategory": {
        this.editCategory(record);
        break;
      }
      case "additem": {
        this.setState({
          isAddItemModal: true,
          isAddCategoryModal: false
        });
        break;
      }
      case "addCategory": {
        this.setState({
          isAddItemModal: false,
          isAddCategoryModal: true
        });
        // this.props.prepareUpdateEvent(record);
        break;
      }
      default: {
        break;
      }
    }
  };

  editItem = record => {
    //console.log("editItem -> ", record);
    this.setState({
      isUpdateItem: record.id ? true : false,
      itemId: record.id || "",
      itemSKU: record.sku || "",
      itemName: record.name,
      quantity: record.quantity,
      rate: record.rate,
      category: record.Category.category_name,
      itemCategory: record.category_id,
      enableAddCategory: false,
      isAddItemModal: true
    });
  };

  editCategory = record => {
    this.setState({
      categoryName: record.category_name,
      categoryId: record.id,
      isAddCategoryModal: true
    });
  };

  deleteItem = (record, e) => {
    //console.log("e -> ", e);

    const itemId = record.id;

    this.props.deleteProducts(itemId, true);
  };

  deleteCategory = (record, e) => {
    //console.log("record -> ", record);
    //console.log("e -> ", e);

    const categoryId = record.id;

    this.props.deleteCategory(categoryId, true);
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
    this.enableAddButton();
    if (this.state.categoryName) {
      this.setState({
        enableAddCategory: true
      });
    } else {
      this.setState({
        enableAddCategory: false
      });
    }
  };

  handleNumberChange = e => {
    var inputNumber = e.target.value ? e.target.value : 0;
    const number = parseInt(inputNumber, 10);

    if (Number.isNaN(number)) {
      return;
    }
    console.log("numberv", number, e);
    if (!("value" in this.props)) {
      //   this.setState({ [e.target.id]: number });
    }
    this.enableAddButton();
  };

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      isAddItemModal: false,
      enableAddButton: false,
      itemName: "",
      itemSKU: "",
      category: "",
      quantity: 0,
      rate: 0,
      category_name: "",
      isAddCategoryModal: false
    });
  };

  enableAddButton = (value, value1) => {
    if (
      this.state.itemName &&
      this.state.category &&
      this.state.itemSKU &&
      this.state.rate &&
      parseInt(this.state.rate, 10) > 0 &&
      this.state.quantity &&
      parseInt(this.state.quantity, 10) > 0
    ) {
      this.setState({
        enableAddItem: true
      });
    } else {
      this.setState({
        enableAddItem: false
      });
    }
  };

  handleAddItem = () => {
    this.props.createProducts(this.state);
    this.setState({
      isAddItemModal: false,
      itemId: "",
      enableAddButton: false,
      itemName: "",
      itemSKU: "",
      category: "",
      quantity: "",
      rate: "",
      category_name: "",
      isAddCategoryModal: false
    });
  };

  handleAddCategory = () => {
    this.props.createCategory(this.state);
    this.setState({
      isAddItemModal: false,
      itemId: "",
      enableAddButton: false,
      itemName: "",
      itemSKU: "",
      category: "",
      quantity: "",
      rate: "",
      category_name: "",
      isAddCategoryModal: false
    });
  };

  onChangeSelectBox = value => {
    this.setState({
      category: value,
      itemCategory: value
    });
    this.enableAddButton();
  };

  ItemModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Add/ Edit the Item"
          visible={this.state.isAddItemModal}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="Add Item"
              onClick={this.handleAddItem}
              disabled={!this.state.enableAddItem}
              type="danger"
            >
              {this.state.itemId ? "Update" : "Add"}
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          <Input
            id="itemName"
            addonBefore="Name"
            disabled={this.state.isUpdateEvent}
            value={this.state.itemName}
            style={{
              width: "65%",
              marginRight: "3%",
              marginTop: "3%"
            }}
            onChange={this.handleChange}
            placeholder="Item Name"
            required
          />
          <Input
            id="itemSKU"
            addonBefore="SKU"
            disabled={this.state.isUpdateEvent}
            value={this.state.itemSKU}
            style={{
              width: "65%",
              marginRight: "3%",
              marginTop: "3%"
            }}
            onChange={this.handleChange}
            placeholder="Item SKU"
            required
          />
          <Select
            showSearch
            style={{ width: "65%", top: 10 }}
            placeholder="Select Category"
            optionFilterProp="children"
            onChange={this.onChangeSelectBox}
            value={
              this.state.category ? this.state.category : "Select Category"
            }
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.props.categories.map(obj => (
              <Option key={obj.category_name} value={obj.id}>
                {obj.category_name}
              </Option>
            ))}
          </Select>
          <Input
            id="quantity"
            addonBefore="Quantity"
            disabled={this.state.isUpdateEvent}
            value={this.state.quantity}
            style={{
              width: "65%",
              marginRight: "3%",
              marginTop: "3%"
            }}
            onChange={e => {
              this.setState({ quantity: e.target.value });

              if (
                this.state.itemName &&
                this.state.category &&
                this.state.itemSKU &&
                this.state.rate &&
                parseInt(this.state.rate, 10) > 0 &&
                e.target.value &&
                parseInt(e.target.value, 10) > 0
              ) {
                this.setState({
                  enableAddItem: true
                });
              } else {
                this.setState({
                  enableAddItem: false
                });
              }
            }}
            placeholder="Quantity"
            required
          />
          <Input
            id="rate"
            addonBefore="Rate"
            disabled={this.state.isUpdateEvent}
            value={this.state.rate}
            style={{
              width: "65%",
              marginRight: "3%",
              marginTop: "3%"
            }}
            onChange={e => {
              this.setState({ rate: e.target.value });
              if (
                this.state.itemName &&
                this.state.category &&
                this.state.itemSKU &&
                this.state.quantity &&
                parseInt(this.state.quantity, 10) > 0 &&
                e.target.value &&
                parseInt(e.target.value, 10) > 0
              ) {
                this.setState({
                  enableAddItem: true
                });
              } else {
                this.setState({
                  enableAddItem: false
                });
              }
            }}
            placeholder="Rate"
            required
          />
        </Modal>
      </React.Fragment>
    );
  };

  CategoryModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Add/ Edit the Item"
          visible={this.state.isAddCategoryModal}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="Add Category"
              onClick={this.handleAddCategory}
              disabled={!this.state.enableAddCategory}
              type="danger"
            >
              {this.state.categoryId ? "Update" : "Add"}
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          <Input
            id="categoryName"
            addonBefore="Name"
            value={this.state.categoryName}
            style={{
              width: "65%",
              marginRight: "3%",
              marginTop: "3%"
            }}
            onChange={this.handleChange}
            placeholder="Category Name"
            required
          />
        </Modal>
      </React.Fragment>
    );
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        ...this.getColumnSearchProps("name")
      },
      {
        title: "SKU",
        dataIndex: "sku",
        sorter: (a, b) => a.sku - b.sku,
        sortDirections: ["descend", "ascend"],
        width: "10%"
      },
      {
        title: "Category",
        dataIndex: "Category.category_name",
        width: "10%"
      },
      {
        title: "Quantity Available",
        dataIndex: "quantity",
        width: "10%"
      },
      {
        title: "Rate",
        dataIndex: "rate",
        width: "10%"
      },
      {
        title: "Edit",
        key: "editItem",
        width: "10%",
        render: (text, record) => (
          <ColumnButton
            title={"Edit Item"}
            record={record}
            id={"editItem"}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Delete",
        key: "delete",
        width: "10%",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to delete the item?"
            onConfirm={e => this.deleteItem(record, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
            {/* <a href="#">Mark Complete</a> */}
          </Popconfirm>
        )
      }
    ];

    const columns1 = [
      {
        title: "Name",
        dataIndex: "category_name",
        width: "20%",
        ...this.getColumnSearchProps("category_name")
      },
      {
        title: "Edit",
        key: "editCategory",
        width: "10%",
        render: (text, record) => (
          <ColumnButton
            title={"Edit Category"}
            record={record}
            id={"editCategory"}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Delete",
        key: "delete",
        width: "10%",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to delete the category?"
            onConfirm={e => this.deleteCategory(record, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
            {/* <a href="#">Mark Complete</a> */}
          </Popconfirm>
        )
      }
    ];
    const itemCount = this.props.itemData ? this.props.itemData.length : 0;
    const categoryCount = this.props.categories
      ? this.props.categories.length
      : 0;

    const count = `Items Count: ${itemCount}`;
    const count1 = `Categories Count: ${categoryCount}`;
    return (
      <React.Fragment>
        <div
          style={{
            width: "80%",
            maxHeight: "100%",
            overflowY: "auto",
            position: "absolute"
          }}
        >
          <Card
            title="Items List"
            extra={count}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 1200,
              textAlign: "center",
              alignContent: "center"
            }}
          >
            <Button
              key="addItem"
              onClick={e =>
                this.setState({
                  isAddItemModal: true,
                  isAddCategoryModal: false
                })
              }
              type="primary"
              style={{ width: 200 }}
            >
              Add Item
            </Button>
            <Table
              columns={columns}
              dataSource={this.props.itemData}
              loading={this.props.fetching}
              scroll={{ y: 400 }}
            />
          </Card>
          <Card
            title="Categories List"
            extra={count1}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 1200,
              textAlign: "center",
              alignContent: "center"
            }}
          >
            <Button
              key="addCategory"
              onClick={e =>
                this.setState({
                  isAddCategoryModal: true,
                  isAddItemModal: false
                })
              }
              type="primary"
              style={{ width: 200 }}
            >
              Add Category
            </Button>
            <Table
              columns={columns1}
              dataSource={this.props.categories}
              loading={this.props.fetching}
              scroll={{ y: 400 }}
            />
          </Card>
          <this.ItemModal />
          <this.CategoryModal />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    itemData: state.eventItems ? state.eventItems.data : [],
    categories: state.categories ? state.categories.data : [],
    fetching: state.drafts ? state.drafts.fetching : fasle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchItems: fetchItems,
      fetchCategorys: fetchCategorys,
      deleteCategory: deleteCategory,
      createCategory: createCategory,
      createProducts: createProducts,
      deleteProducts: deleteProducts
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemListPage);
