export default {
  orderList: {
    meta: {
      total: 0,
      pageSize: 5,
      pageSizeOptions: ["1", "10", "20", "40"]
    },
    data: [],
    fetching: false,
    receiveAmount: false,
    error: null
  },
  createEvent: {
    eventDate: "",
    eventStartDate: "",
    eventEndDate: "",
    processedOrderNo: null,
    orderNo: null,
    isPendingCreation: null,
    isError: null
  },
  drafts: {
    eventDate: "",
    eventStartDate: "",
    eventEndDate: "",
    isDraft: false,
    processedOrderNo: null,
    data: [],
    fetching: false,
    orderNo: null,
    isPendingCreation: null,
    isError: null
  },
  categories: {
    data: [],
    fetching: false,
    isError: null
  },
  customers: {
    data: [],
    fetching: false,
    isError: null
  },
  targets: {
    data: [],
    fetching: false,
    auth: "",
    signInModal: false,
    signInError: "",
    closeOrdStats: "",
    nonClosedOrdStats: "",
    overDueOrdStats: "",
    yearlyOrdStats: "",
    isError: null
  },
  eventItem: {
    meta: {
      total: 0,
      pageSize: 5,
      pageSizeOptions: ["1", "10", "20", "40"]
    },
    data: [],
    modifiedItems: [],
    selectedRowKeys: [],
    orderedData: [],
    category: [],
    fetchingUpdatedQuantity: false,
    diableOkButton: true,
    fetching: false,
    error: null
  },
  prepareUpdateEvent: {
    isEventUpdate: false
  },
  upcomingOrder: {
    meta: {
      total: 0,
      pageSize: 5,
      pageSizeOptions: ["1", "10", "20", "40"]
    },
    data: [],
    fetching: false,
    receiveAmount: false,
    error: null
  },
  homeOrders: {
    data: {},
    fetching: false,
    error: null
  },
  backup: {
    fetching: false
  },
  print: {
    url: "",
    fetching: false,
    error: null
  },
  itemExpense: {
    data: {},
    fetching: false,
    error: null
  },
  customer: null,
  orderDetail: null
};
