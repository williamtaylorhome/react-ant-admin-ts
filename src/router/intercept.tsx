import { useCallback, useEffect, useMemo, useState } from "react";
import { Spin } from "antd"
import { getMenuParentKey } from "@/utils";
import { useDidRecover } from "react-router-cache-route";
import Error from "@/pages/err";
import { useLocation } from "react-router-dom";
import { MenuItem } from "@/types";
import { useDispatchMenu } from "@/store/hooks";

const scrollPage = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

const fallback = <Spin style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 500,
  fontSize: 24,
}} tip="Page loading...." />

interface Props {
  [MENU_PATH]?: string
  [MENU_TITLE]?: string
  pageKey: string
  menuList: Array<MenuItem>
  [key: string]: any
}

function Intercept({ menuList, components: Components, [MENU_TITLE]: title, [MENU_PATH]: pagePath, pageKey, ...itemProps }: Props) {
  const [pageInit, setPageInit] = useState(false)
  const location = useLocation()
  const { stateSetOpenMenuKey, stateSetSelectMenuKey, stateAddOpenedMenu, stateSetCurrentPath } = useDispatchMenu()

  const currentPath = useMemo(() => {
    const { pathname, search } = location
    return pathname + search
  }, [location])

  // 监听 location 改变
  const onPathChange = useCallback(() => {
    stateSetCurrentPath(currentPath)
    stateSetSelectMenuKey([String(pageKey)]);
    stateAddOpenedMenu({ key: pageKey, path: currentPath, title: title || "Title information is not set" });
  }, [currentPath, pageKey, title, stateSetCurrentPath, stateAddOpenedMenu, stateSetSelectMenuKey])

  const setCurrentPageInfo = useCallback(() => {
    if (!title) {
      return;
    }
    document.title = title;
    stateSetSelectMenuKey([String(pageKey)]);
    let openkey = getMenuParentKey(menuList, Number(pageKey));
    stateSetOpenMenuKey(openkey);
    console.log(title, openkey, pageKey);
    stateAddOpenedMenu({ key: pageKey, path: currentPath, title });
  }, [currentPath, menuList, title, pageKey, stateSetOpenMenuKey, stateSetSelectMenuKey, stateAddOpenedMenu])

  const init = useCallback(() => {
    setCurrentPageInfo()
    scrollPage()
  }, [setCurrentPageInfo])

  useEffect(() => {
    if (init && !pageInit) {
      init()
      setPageInit(true)
    }
  }, [init, pageInit])

  useEffect(() => {
    if (!pageInit) {
      onPathChange()
    }
  }, [onPathChange, pageInit])
  // Cache activation
  useDidRecover(() => {
    onPathChange()
  }, [onPathChange])

  const hasPath = !menuList.find(
    (m) => (m[MENU_PARENTPATH] || "") + m[MENU_PATH] === pagePath
  );

  if (hasPath && pagePath !== "/" && pagePath !== "*") {
    return (
      <Error
        status="403"
        errTitle="Permissions are insufficient"
        subTitle="Sorry, you are not authorized to access this page."
      />
    );
  }

  return (
    <Components
      {...itemProps}
      fallback={fallback}
    />
  );
}
export default Intercept
