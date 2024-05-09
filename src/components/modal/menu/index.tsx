import { ReactNode, useEffect, useState } from "react";
import MyIcon from "@/components/icon";
import MyForm, { FormItemData } from "@/components/form";
import { Modal, Select, message, FormInstance } from "antd";
import { addMenu, getMenuInfo, editMenu } from "@/api";
import { MenuList, MenuItem } from "@/types"
import { ModalType, SelectInfo } from "@/pages/power/menu"
import "./index.less";
interface IconItem {
  icon_id: string,
  name: string,
  font_class: string,
  unicode: string,
  unicode_decimal: number
}

interface MenuModalProps {
  info: SelectInfo
  modalType: ModalType
  isShow: boolean
  setShow: (s: boolean) => void
  updateMenu: () => void
  menus: MenuList
}

interface ActiveFn {
  add: (data: MenuItem) => void;
  edit: (data: MenuItem) => void;
  addChild: (data: MenuItem) => void;
}
const ICON_JSON = require("@/assets/json/iconfont.json");
const ICON_PREFIX: string = ICON_JSON.css_prefix_text;
const ICON_DATA: IconItem[] = ICON_JSON.glyphs;
const { Option } = Select;
const titleType: {
  add: string;
  addChild: string;
  edit: string;
} = {
  add: "New menu",
  addChild: "Added submenus",
  edit: "Modify the menu information",
};

const initFormItems: FormItemData[] = [
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu title" }],
      label: "Menu title",
      name: MENU_TITLE,
    },
    childProps: {
      placeholder: "Menu title",
    },
  },
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu path" }],
      label: "Menu path",
      name: MENU_PATH,
    },
    childProps: {
      placeholder: "Menu path",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "Parent menu",
      name: MENU_PARENTKEY,
    },
    childProps: {
      placeholder: "Parent menu",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "menu icon",
      name: MENU_ICON,
    },
    childProps: {
      placeholder: "icon",
      allowClear: true,
      showSearch: true,
      getPopupContainer: (v: ReactNode) => v,
      children: ICON_DATA.map((icon) => (
        <Option value={ICON_PREFIX + icon.font_class} key={icon.icon_id}>
          <div className="icons">
            <MyIcon type={ICON_PREFIX + icon.font_class} />
            <span className="title"> {icon.font_class}</span>
          </div>
        </Option>
      )),
    },
  },
  {
    itemType: "radio",
    itemProps: {
      rules: [{ required: true, message: "Please select the menu caching mode" }],
      name: MENU_KEEPALIVE,
      label: "Whether the page is cached or not",
    },
    childProps: {
      options: [
        { label: "yes", value: "true" },
        { label: "no", value: "false" },
      ],
    },
  },
  {
    itemType: "inputNumber",
    itemProps: {
      className: "ipt-number",
      rules: [
        {
          type: "number",
          min: 0,
          max: 10000,
          message: "Please fill in the menu sort size correctly",
        },
        { required: true, message: "Please fill in the menu sort size" },
      ],
      name: MENU_ORDER,
      label: "Menu sorting",
    },
    childProps: {
      placeholder: "The lower the number, the higher the value",
    },
  },
];

function getMenuList(list: MenuList, id: number | string) {
  let menu: MenuList = []
  const findList = (ls: MenuList): boolean => {
    return ls.some(item => {
      let l = item[MENU_CHILDREN]
      if (item[MENU_KEY] === id) {
        menu = ls
        return true
      } else if (Array.isArray(l) && l.length) {
        let d = findList(l)
        if (d) {
          menu = l
        }
        return d
      }
      return false
    })
  }
  findList(list)
  return menu
}


export default function MenuModal({
  info,
  modalType = "add",
  isShow,
  setShow,
  updateMenu,
  menus = [],
}: MenuModalProps) {
  const [form, setForm] = useState<FormInstance | null>(null);
  const [activeFn] = useState<ActiveFn>({ add, edit, addChild: add });
  const [formItems, setItems] = useState<FormItemData[]>([]);
  // form item
  useEffect(() => {
    if (modalType !== "add" && menus && info) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items.forEach((i) => {
        if (i.itemProps.name === MENU_PARENTKEY) {
          let disabled = modalType === "addChild" || (modalType === "edit" && info.isParent);
          i.childProps && (i.childProps.disabled = disabled)
          let childrenList = modalType === "addChild" ? getMenuList(menus, info[MENU_KEY] as string) : menus
          if (i.childProps) {
            i.childProps.children = childrenList.map((menu) => (
              <Option value={menu.key} key={menu.key}>
                <div className="icons">
                  <MyIcon type={menu.icon as string} />
                  <span className="title"> {menu.title}</span>
                </div>
              </Option>
            ));
          }

        }
      });
      setItems(items);
    } else if (info && modalType === "add" && menus) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items = items.filter((i) => i.itemProps.name !== MENU_PARENTKEY);
      setItems(items);
    }
  }, [modalType, info, menus]);

  useEffect(() => {
    if (modalType === "edit" && isShow && form) {
      getMenuInfo({ key: info && info[MENU_KEY] }).then((res) => {
        if (res.status === 0 && res.data) {
          form.setFieldsValue(res.data);
        }
      });
    } else if (modalType === "addChild" && isShow && form) {
      form.setFieldsValue({
        [MENU_PARENTKEY]: info && info[MENU_KEY],
      });
    }
  }, [modalType, isShow, info, form]);
  // Submit the form
  const submit = () => {
    form && form.validateFields().then((values) => {
      let fn = activeFn[modalType];
      fn(values);
    });
  };

  const onCancel = () => {
    form && form.resetFields();
    setShow(false);
  };
  function edit(data: MenuItem) {
    editMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  function add(data: MenuItem) {
    addMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  return (
    <Modal
      maskClosable={false}
      title={titleType[modalType]}
      visible={isShow}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  );
}
