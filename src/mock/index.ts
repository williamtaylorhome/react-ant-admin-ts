import dayjs from "dayjs";
import { message } from "antd";
import { PowerApi, LoginApi, ResponseData, MenuInfoApi, MessageList, MessageAPi, MenuResponse, MenuList, MenuItem } from "@/types"
import { formatMenu } from "@/utils";

type MockDataType = {
  "/getmenu": MenuResponse
  "/getpower": PowerApi
  "/login": LoginApi
  "/addmenu": ResponseData
  "/addmessage": ResponseData
  "/getmessage": MessageAPi
  "/delmenu": ResponseData
  "/getmenuinfo": ResponseData & { data: MenuItem | null }
  "/editmenuinfo": ResponseData
  "/getvisitordata": ResponseData
  [key: string]: ResponseData | MenuList | PowerApi | LoginApi | MenuInfoApi | MenuResponse
}

const userInfoList = [
  {
    user_id: 1,
    username: "Classmate Zhang",
    account: "admin",
    type_id: "super administrator",
    t_id: 1,
  },
  {
    user_id: 2,
    username: "Wang Wu",
    account: "user",
    type_id: "user",
    t_id: 2,
  },
  {
    user_id: 4,
    username: "John Doe",
    account: "qq123456",
    type_id: "tourists",
    t_id: 3,
  },
  {
    user_id: 5,
    username: "passing rat",
    account: "jake",
    type_id: "low power tourist",
    t_id: 4,
  },
  {
    user_id: 6,
    username: "webmaster",
    account: "superAdmin",
    type_id: "super administrator",
    t_id: 1,
  },
];
let currentUser = userInfoList[0];

let menu: MenuList = [
  {
    [MENU_TITLE]: "List",
    [MENU_PATH]: "/list",
    [MENU_KEY]: 9,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_list",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    menu_id: 10,
    [MENU_TITLE]: "card list",
    [MENU_PATH]: "/card",
    [MENU_KEY]: 10,
    [MENU_PARENTKEY]: 9,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 5485,
  },
  {
    [MENU_TITLE]: "query list",
    [MENU_PATH]: "/search",
    [MENU_KEY]: 11,
    [MENU_PARENTKEY]: 9,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9588,
  },
  {
    [MENU_TITLE]: "form page",
    [MENU_PATH]: "/form",
    [MENU_KEY]: 7,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_form",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 3,
  },
  {
    [MENU_TITLE]: "basic form",
    [MENU_PATH]: "/index",
    [MENU_KEY]: 6,
    [MENU_PARENTKEY]: 7,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9654,
  },
  {
    [MENU_TITLE]: "Details page",
    [MENU_PATH]: "/details",
    [MENU_KEY]: 1,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_edit",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 3,
  },
  {
    [MENU_TITLE]: "Personal Center",
    [MENU_PATH]: "/person",
    [MENU_KEY]: 2,
    [MENU_PARENTKEY]: 1,
    [MENU_ICON]: "icon_infopersonal",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9998,
  },
  {
    [MENU_TITLE]: "Results page",
    [MENU_PATH]: "/result",
    [MENU_KEY]: 16,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_voiceprint",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 4,
  },
  {
    [MENU_TITLE]: "403",
    [MENU_PATH]: "/403",
    [MENU_KEY]: 3,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_locking",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 0,
  },
  {
    [MENU_TITLE]: "404",
    [MENU_PATH]: "/404",
    [MENU_KEY]: 4,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_close",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "500",
    [MENU_PATH]: "/500",
    [MENU_KEY]: 5,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_privacy_closed",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 4568,
  },
  {
    [MENU_TITLE]: "statistics",
    [MENU_PATH]: "/statistics",
    [MENU_KEY]: 17,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_MTR",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 5,
  },
  {
    [MENU_TITLE]: "Visitor statistics",
    [MENU_PATH]: "/visitor",
    [MENU_KEY]: 18,
    [MENU_PARENTKEY]: 17,
    [MENU_ICON]: "icon_addresslist",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "System Management",
    [MENU_PATH]: "/power",
    [MENU_KEY]: 12,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_set",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9,
  },
  {
    [MENU_TITLE]: "Permission Category",
    [MENU_PATH]: "/type",
    [MENU_KEY]: 14,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_safety",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 12,
  },
  {
    [MENU_TITLE]: "Menu management",
    [MENU_PATH]: "/menu",
    [MENU_KEY]: 13,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_menu",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1475,
  },
  {
    [MENU_TITLE]: "User Management",
    [MENU_PATH]: "/user",
    [MENU_KEY]: 15,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_infopersonal",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1593,
  },
  {
    [MENU_TITLE]: "Icon library",
    [MENU_PATH]: "/icons",
    [MENU_KEY]: 8,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_pen",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 10,
  },
];
const typeList = [
  {
    type_id: 1,
    name: "super administrator",
    menu_id: "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1",
  },
  { type_id: 2, name: "user", menu_id: "1,9,10,11,2,7,6,17,18,16,3,4,5,8" },
  { type_id: 3, name: "tourists", menu_id: "9,1,10,11,2,7,6,17,18,12" },
  { type_id: 4, name: "low power tourist", menu_id: "9,10" },
];
const power = {
  status: 0,
  data: typeList,
  mapKey: [
    { title: "permission id", dataIndex: "type_id", key: "type_id" },
    { title: "Permission abbreviation", dataIndex: "name", key: "name" },
    { title: "Show menu list id", dataIndex: "menu_id", key: "menu_id" },
  ],
  menu: formatMenu(menu),
};

const userInfo = {
  msg: "login successful",
  status: 0,
  token: "12323",
  data: { user_id: 1, username: "Super Admin", account: "admin", type: "0", isLogin: true },
};

const addMenu = {
  msg: "The addition is successful, the menu bar needs to be closed and reopened to take effect!",
  status: 0,
};
const addMsg = { msg: "Added successfully", status: 0 };

const msgList: MessageList = [
  {
    m_id: 1,
    name: "first message",
    description: "First day message I created",
    creator: "super administrator",
    add_time: "2021-04-20 17:01:09",
  },
  {
    m_id: 2,
    name: "RegExp",
    description:
      "The RegExp object represents a regular expression, which is a powerful tool for performing pattern matching on strings.",
    creator: "super administrator",
    add_time: "2021-04-20 17:48:42",
  },
  {
    m_id: 3,
    name: "Ant Design",
    description:
      "antd is a React UI component library based on the Ant Design design system, which is mainly used for the development of enterprise-level middle and back-end products.",
    creator: "Super Admin",
    add_time: "2021-04-20 17:46:44",
  },
  {
    m_id: 4,
    name: "react-ant-admin",
    description:
      "This framework is used with secondary development, the front-end framework uses React, the UI framework uses Ant Design, the global data state management uses Redux, and the AJAX library is axios. It is used to quickly build middle and back office pages.",
    creator: "Super Admin",
    add_time: "2021-04-20 17:28:45",
  },
];
const msg: MessageAPi = {
  status: 0,
  data: {
    mapKey: [
      { title: "message id", dataIndex: "m_id", key: "m_id" },
      { title: "Message name", dataIndex: "name", key: "name" },
      { title: "message descriptor", dataIndex: "description", key: "description" },
      { title: "founder", dataIndex: "creator", key: "creator" },
      { title: "creation time", dataIndex: "add_time", key: "add_time" },
    ],
    list: msgList,
    total: 4,
  },

  msg: "",
};
const delMenu = { msg: "操作成功", status: 0 };
// const MenuMapKey = [
//   { title: "Menu ID", dataIndex: "menu_id", key: "menu_id" },
//   { title: "Menu name", dataIndex: "title", key: "title" },
//   { title: "Menu routing", dataIndex: "path", key: "path" },
//   { title: "Menu unique key", dataIndex: "key", key: "key" },
//   { title: "Menu parent key", dataIndex: "parentKey", key: "parentKey" },
//   { title: "menu icon", dataIndex: "icon", key: "icon" },
//   { title: "Whether the page remains in a state", dataIndex: "keepAlive", key: "keepAlive" },
//   { title: "Menu sorting", dataIndex: "order", key: "order" },
// ]
const MockData: MockDataType = {
  "/getmenu": formatMenu(menu),
  "/getpower": power,
  "/login": userInfo,
  "/addmenu": addMenu,
  "/addmessage": addMsg,
  "/getmessage": msg,
  "/delmenu": delMenu,
  "/getmenuinfo": { status: 0, msg: '', data: null },
  "/editmenuinfo": { status: 0, msg: "Modification successful!" },
  "/getvisitordata": { status: 1, msg: "Not yet" },
};
type UrlType = keyof MockDataType
function get(url: UrlType) {
  return new Promise((res) => {
    setTimeout(() => {
      if (url === "/getmenu") {
        let typeId = currentUser.t_id;
        if (typeId) {
          let action: string | undefined | number[] = typeList.find((i) => i.type_id === typeId)?.menu_id;
          action = action ? action.split(",").map(Number) : [];
          let menuList = menu.filter((i) => (action as number[]).includes(i[MENU_KEY] as number));
          MockData[url] = formatMenu(menuList);
        }
        res(MockData[url]);

        return;
      }
      res(MockData[url]);
    }, 500);
  }).then((res) => {
    if (res) {
      return res
    } else {
      message.error("The interface is not configured")
      return Promise.reject("The interface is not configured")
    }
  });
}



function post(url: UrlType, data: any) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      switch (url) {
        case "/login":
          userInfo.data.account = data.account;
          if (data.account.indexOf("admin") === -1) {
            userInfo.data.type = "1";
            userInfo.data.username = "Regular users";
          }
          return res(userInfo);
        case "/addmenu":
          menu.push(data);
          return res(MockData[url]);
        case "/addmessage":
          msgList.push({
            ...data,
            m_id: Math.random(),
            creator: userInfo.data.username,
            add_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          });
          if (msg.data) {
            msg.data.total = msgList.length;
          }
          return res(MockData[url]);
        case "/delmenu":
          let newMenu = menu.filter((i) => i[MENU_KEY] !== data[MENU_KEY]);
          menu = newMenu.filter((i) => i[MENU_PARENTKEY] !== data[MENU_KEY]);
          return res(MockData[url]);
        case "/getmenuinfo": {
          const findInfo = menu.find((i) => i[MENU_KEY] === data[MENU_KEY]);
          if (findInfo) {
            MockData[url].data = findInfo;
          }
          return res(MockData[url]);
        }
        case "/editmenuinfo":
          menu = menu.map((item) => {
            if (item[MENU_KEY] === data[MENU_KEY]) {
              return data;
            }
            return item;
          });
          return res(MockData[url]);
        case "/getmessage":
          let list = [...msgList];
          if (data.name) {
            list = list.filter((i) => i.name.includes(data.name));
          }
          if (data.description) {
            list = list.filter((i) => i.description.includes(data.description));
          }

          if (msg.data) {
            msg.data.total = list.length;
            msg.data.list = list;
          }
          return res(msg);
        default:
          res({ status: 1, msg: "Not yet" });
          break;
      }
    }, 100);
  }).then((res: any) => {
    if (res.status === 0) {
      return res
    } else {
      message.error("The interface is not configured")
      return Promise.reject("The interface is not configured")
    }
  });
}


const mock = { get, post };

export default mock;
