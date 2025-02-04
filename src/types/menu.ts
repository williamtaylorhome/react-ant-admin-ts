import { MapKey } from "./api"

// About the menu Akshen of Stat
export type MenuAction = {
  type: string
  keys: string[]
  menuItem: OpenedMenu
  list: MenuItem[],
  path: string
}

// 

export interface OpenedMenu {
  key: string
  path: string
  title: string
}

export interface MenuState {
  openedMenu: OpenedMenu[]
  openMenuKey: string[]
  selectMenuKey: string[]
  menuList: MenuItem[],
  currentPath: string
}

// Unprocessed menu list information
export interface MenuItem {
  [MENU_ICON]: string | null
  [MENU_KEEPALIVE]: string
  [MENU_KEY]: number
  [MENU_ORDER]: number
  [MENU_PARENTKEY]: number | null
  [MENU_PATH]: string
  [MENU_TITLE]: string
  [MENU_CHILDREN]?: MenuList
  [MENU_PARENTPATH]?: string
  [MENU_SHOW]?: boolean | string
  [key: string]: any
}

export type MenuMap = {
  [key: string]: {
    [MENU_CHILDREN]: Array<MenuItem>
  } | MenuItem
} | {
  [key: string]: MenuItem
}

export type MenuList = MenuItem[]


export type MenuResponse = MenuList

export type MenuListResponse = {
  data: MenuList,
  mapKey: MapKey
}
