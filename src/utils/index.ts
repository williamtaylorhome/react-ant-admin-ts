import { getMenus, } from "@/common";
import { MenuItem, MenuList, UserInfo, LayoutMode, MenuResponse, State, MenuMap } from "@/types"
export const USER_INFO = "USER_INFO";
export const TOKEN = "admin_token";
export const MENU = "MENU";
export const VISIBLE = "COMPONENTS_VISIBLE";
export const LAYOUT_MODE = "LAYOUT_MODE";

interface MenuOpenData {
  openKeys: string[]
  selectKey: string[]
  openedMenu: MenuItem[]
}
type Token = string | null | undefined

// Get the default page
async function getDefaultMenu(): Promise<MenuOpenData> {
  let openKeys: string[] = [],
    selectKey: string[] = [],
    openedMenu: MenuItem[] = [];
  const menuList = await getMenus();
  menuList.some((menu) => {
    const child = menu[MENU_CHILDREN]
    if (child && child.length) {
      openKeys = [String(menu[MENU_KEY])];
      selectKey = [String(child[0][MENU_KEY])];
      openedMenu = [child[0]];
      return true;
    }
    return false;
  });

  return {
    openKeys,
    selectKey,
    openedMenu,
  };
}

function getSessionUser() {
  return getKey(false, USER_INFO);
}

function saveUser(info: UserInfo) {
  setKey(true, USER_INFO, info);
  setKey(false, USER_INFO, info);
}

function sleep(seconed: number) {
  return new Promise((res, rej) => {
    setTimeout(res, seconed);
  });
}

function getLocalUser() {
  return getKey(true, USER_INFO);
}


function getMenuParentKey(list: MenuList, key: number): string[] {
  const keys = [];
  const info = list.find((item) => item[MENU_KEY] === key);
  let parentKey = info?.[MENU_PARENTKEY];
  if (parentKey) {
    const data = getMenuParentKey(list, parentKey)
    keys.push(...data);
    keys.push(String(parentKey));
  }
  return keys;
}

export function formatMenu(list: MenuList) {
  const newList = list.map(item => ({ ...item }))
  const menuMap: MenuMap = {};
  const parentMenu: MenuList = [];
  newList.forEach((item) => {
    // The key of the current menu
    const currentKey = item[MENU_KEY];
    // The parent menu key of the current menu
    const currentParentKey = item[MENU_PARENTKEY];
    // If the mapping table doesn't already have a value, assign the current item to it
    if (!menuMap[currentKey]) {
      menuMap[currentKey] = item;
    } else {
      // ValuedDescription Has a child Keeps a child Assign the current value to it
      item[MENU_CHILDREN] = menuMap[currentKey][MENU_CHILDREN];
      menuMap[currentKey] = item;
    }
    // If the current item has a parent
    if (currentParentKey) {
      // The parent is not yet on the mapping table
      if (!menuMap[currentParentKey]) {
        // Then map it to only a subset of property <Array>types
        menuMap[currentParentKey] = {
          [MENU_CHILDREN]: [item],
        };
      } else if (
        menuMap[currentParentKey] &&
        !menuMap[currentParentKey][MENU_CHILDREN]
      ) {
        // The parent is on the mapping table, but there is no subset
        menuMap[currentParentKey][MENU_CHILDREN] = [item];
      } else {
        // There are parental and child collections
        menuMap[currentParentKey][MENU_CHILDREN]?.push(item);
      }
    } else {
      // The current item is unparented, then the current item is the parent item
      parentMenu.push(item);
    }
  });
  return parentMenu;
}


function reduceMenuList(list: MenuList, path: string = ''): MenuList {
  const data: MenuList = [];
  list.forEach((i) => {
    const { [MENU_CHILDREN]: children, ...item } = i;
    item[MENU_PARENTPATH] = path;
    if (children) {
      const childList = reduceMenuList(children, path + i[MENU_PATH]);
      data.push(...childList);
    }
    data.push(item);
  });
  return data;
}

function getLocalMenu(): MenuResponse | null {
  return getKey(false, MENU);
}

function saveLocalMenu(list: MenuResponse) {
  setKey(false, MENU, list);
}

function saveToken(token: Token) {
  setKey(true, TOKEN, token)
}

function getToken(): Token {
  return getKey(true, TOKEN)
}

function getKey(isLocal: boolean, key: string) {
  return JSON.parse(getStorage(isLocal).getItem(key) || "null");
}
function getStorage(isLocal: boolean) {
  return isLocal ? window.localStorage : window.sessionStorage;
}
function setKey(isLocal: boolean, key: string, data: any) {
  getStorage(isLocal).setItem(key, JSON.stringify(data || null));
}

function rmKey(isLocal: boolean, key: string) {
  getStorage(isLocal).removeItem(key);
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

function getLayoutMode(): LayoutMode | null {
  return getKey(true, LAYOUT_MODE);
}
function setLayoutMode(data: LayoutMode) {
  setKey(true, LAYOUT_MODE, data);
}
function clearLocalDatas(keys: string[]) {
  keys.forEach((key) => {
    rmKey(true, key);
    rmKey(false, key);
  });
}
function getCompVisible(): State["componentsVisible"] | null {
  return getKey(true, VISIBLE);
}
function setCompVisible(val: State["componentsVisible"]) {
  return setKey(true, VISIBLE, val);
}

export {
  getDefaultMenu,
  getSessionUser,
  saveUser,
  sleep,
  getLocalUser,
  getMenuParentKey,
  reduceMenuList,
  getLocalMenu,
  saveLocalMenu,
  saveToken,
  getToken,
  getKey,
  setKey,
  rmKey,
  stopPropagation,
  getLayoutMode,
  setLayoutMode,
  clearLocalDatas,
  getCompVisible,
  setCompVisible,
};
