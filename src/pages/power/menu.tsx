import { useEffect, useState } from "react";
import { Row, Button, message, Popconfirm } from "antd";
import { getMenuList as apiGetList, delMenu } from "@/api";
import MenuModal from "@/components/modal/menu";
import MyTable from "@/components/table";
import MyIcon from "@/components/icon";
import { MenuList, MapKey } from "@/types"
import "./index.less";


export type ModalType = "add" | "addChild" | "edit"
export type SelectInfo = {
  [MENU_KEY]?: string
  isParent?: Boolean
}

function useMenu() {
  const [menus, setMenu] = useState<MenuList>([]);
  const [tabCol, setCol] = useState<MapKey>([]);
  const [selectInfo, setSelectInfo] = useState<SelectInfo>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add');


  const menuAction = {
    title: "operation",
    dataIndex: "action",
    key: "action",
    align: "center",
    render: (text: any, record: any) => {
      return (
        <Row>
          <Button type="link" onClick={() => openModal("edit", record)}>
            edit
          </Button>
          <Button type="link" onClick={() => openModal("addChild", record)}>
            Add a submenu
          </Button>
          <Popconfirm
            onConfirm={() => deleteMenu(record)}
            okText="Confirm"
            title="Deleting a selected menu will delete all the submenus under it at the same time."
            cancelText="Cancel"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Row>
      );
    },
  };
  const getMenuList = () => {
    apiGetList().then((res) => {
      if (res) {
        res.mapKey.push(menuAction);
        res.mapKey.forEach((item) => {
          if (item.dataIndex === "icon") {
            item.render = (text: string | null) =>
              text ? <MyIcon className="preview" type={text} /> : "Not set yet";
          } else if (item.dataIndex === MENU_KEEPALIVE) {
            item.render = (text: string) => (text === "true" ? "retention" : "Turn off the destruction");
          } else if (item.dataIndex === MENU_SHOW) {
            item.render = (t: string) => t === "true" ? 'display' : 'hide'
          }
        });
        setCol(res.mapKey);
        setMenu(res.data);
      }
    });
  };

  useEffect(() => {
    getMenuList();
    // eslint-disable-next-line
  }, []);

  const openModal = (type: ModalType, { [MENU_KEY]: key, isParent }: SelectInfo) => {
    setSelectInfo({ [MENU_KEY]: key, isParent: !Boolean(isParent) });
    setModalType(type);
    setShowModal(true);
  };

  const deleteMenu = (info: any) => {
    delMenu(info).then((res) => {
      const { msg, status } = res;
      if (status === 0) {
        message.success(msg);
        getMenuList();
      }
    });
  };
  const addMenu = () => {
    openModal("add", {});
  };
  return {
    selectInfo,
    menus,
    showModal,
    modalType,
    tabCol,
    setShowModal,
    getMenuList,
    addMenu,
  };
}

export default function Menu() {
  const {
    selectInfo,
    menus,
    showModal,
    modalType,
    tabCol,
    setShowModal,
    getMenuList,
    addMenu,
  } = useMenu();
  return (
    <div className="powermenu-container">
      <Button type="primary" onClick={addMenu}>
        New menu
      </Button>
      <MyTable dataSource={menus} rowKey={`${MENU_KEY}`} columns={tabCol} saveKey="MENUTABLE" />
      <MenuModal
        menus={menus}
        isShow={showModal}
        info={selectInfo}
        modalType={modalType}
        setShow={setShowModal}
        updateMenu={getMenuList}
      />
    </div>
  );
}

Menu.route = {
  [MENU_PATH]: "/power/menu"
}