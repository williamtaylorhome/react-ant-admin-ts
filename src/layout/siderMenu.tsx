import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Affix, Col } from "antd";
import MyIcon from "@/components/icon";
import { stopPropagation } from "@/utils";
import { MenuItem } from "@/types"
import * as layoutTypes from "@/store/layout/actionTypes";
import { useDispatchMenu, useStateLayout, useStateMenuList, useStateOpenMenuKey, useStateSelectMenuKey } from "@/store/hooks";



const { Sider } = Layout;
const { SubMenu } = Menu;


const renderMenu = (item: MenuItem, path: string) => {
  if (item[MENU_SHOW] === "false") {
    return null;
  }
  if (!item.children) {
    return <Menu.Item key={String(item[MENU_KEY])} icon={<MyIcon type={item[MENU_ICON] as string} />}>
      <Link to={path + item[MENU_PATH]}>{item[MENU_TITLE]}</Link>
    </Menu.Item>
  }
  return (
    <SubMenu
      key={String(item[MENU_KEY])}
      title={item[MENU_TITLE]}
      icon={<MyIcon type={item[MENU_ICON] as string} />}
    >
      {item.children.map(i => renderMenu(i, path + item[MENU_PATH]))}
    </SubMenu>
  );
};

const FlexBox = ({ children }: { children: JSX.Element }) => {
  return (
    <Col sm={6} md={10} lg={15} className="fl">
      {children}
    </Col>
  );
}
const SliderContent = ({ children }: { children: JSX.Element }) => {
  const [collapsed, setCollapsed] = useState(false);
  // Collapse the menu
  const toggleCollapsed = (e: any) => {
    setCollapsed(!collapsed);
    stopPropagation(e);
  };
  return (
    <Affix>
      <Sider width={200} collapsed={collapsed} >
        {children}
        <div className="fold-control fixed">
          <Button onClick={toggleCollapsed}>
            {collapsed ? "unfold" : "Collapse"}
            <MyIcon type={collapsed ? "icon_next" : "icon_back"} />
          </Button>
        </div>
      </Sider>
    </Affix>
  );
};
export default function SiderMenu() {
  const openKeys = useStateOpenMenuKey()
  const selectedKeys = useStateSelectMenuKey()
  const layout = useStateLayout()
  const menuList = useStateMenuList()
  // The menu group collapses
  const { stateSetOpenMenuKey: onOpenChange } = useDispatchMenu()
  // Menu options
  const menuComponent = useMemo(() => menuList.map(m => renderMenu(m, '')), [menuList]);

  const WrapContainer = useMemo(() => layout === layoutTypes.SINGLE_COLUMN ? FlexBox : SliderContent, [layout])

  // Classname
  const clsName = useMemo(() => {
    if (layout !== layoutTypes.SINGLE_COLUMN) {
      return "layout-silder-menu hide-scrollbar"
    }
    return "layout-silder-menu col"
  }, [layout])

  const mode = useMemo(() => {
    if (layout === layoutTypes.SINGLE_COLUMN) {
      return "horizontal"
    }
    return "inline"
  }, [layout])

  return <WrapContainer>
    <Menu
      mode={mode}
      triggerSubMenuAction="click"
      className={clsName}
      onOpenChange={onOpenChange}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      children={menuComponent}
    />
  </WrapContainer>;
};
