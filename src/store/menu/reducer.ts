import * as actionTypes from "./actionTypes";
import { MenuAction, MenuState } from "@/types"


const initGlobalState: MenuState = {
  openedMenu: [], // Save the already open menu bar for top navigation
  openMenuKey: [], // The key of the open menu bar is used for the sidebar
  selectMenuKey: [], // Select the key user sidebar in the menu bar
  menuList: [],
  currentPath: "", // The current path of the page
};

export default function reducer(state = initGlobalState, action: MenuAction): MenuState {
  const { type, menuItem, keys, list, path } = action;
  switch (type) {
    case actionTypes.ADDOPENTMENU: {
      let index = state.openedMenu.findIndex(i => i.path === menuItem.path)
      const openedMenu = [...state.openedMenu];
      // Didn't find it
      if (menuItem && !~index) {
        openedMenu.push(menuItem);
        return { ...state, openedMenu };
      } else if (~index && openedMenu[index].path === menuItem.path && openedMenu[index].key !== menuItem.key) {
        // If you find and the key is different, replace it
        return { ...state, openedMenu: [...openedMenu.slice(0, index), menuItem, ...openedMenu.slice(index + 1)] }
      }
      return state;
    }
    case actionTypes.SET_OPENKEY: {
      let oldKeys = state.openMenuKey;
      let isSame = keys.every((item, index) => item === oldKeys[index]);
      let flag = keys.length === oldKeys.length && isSame;
      if (flag) {
        return state;
      }
      return { ...state, openMenuKey: keys };
    }
    case actionTypes.SET_SELECTKEY: {
      if (state.selectMenuKey[0] === keys[0]) {
        return state;
      }
      return { ...state, selectMenuKey: keys };
    }
    case actionTypes.FILTER_OPENKEY: {
      const openedMenu = state.openedMenu.filter((i) => !keys.includes(i.path));
      if (state.openedMenu.length === openedMenu.length) {
        return state;
      }
      return { ...state, openedMenu };
    }
    case actionTypes.SET_USERMENU: {
      return { ...state, menuList: list };
    }
    case actionTypes.SETCURRENTPATH: {
      return { ...state, currentPath: path }
    }
    default: {
      return state;
    }
  }
}
