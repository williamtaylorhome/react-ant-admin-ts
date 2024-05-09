import { useEffect, useMemo, useState } from "react";
import { Route } from "react-router-dom";
import { CacheRoute, CacheSwitch } from "react-router-cache-route";
import routerList, { RouterInfo } from "./list";
import Intercept from "./intercept";
import { getMenus } from "@/common";
import { formatMenu, reduceMenuList } from "@/utils";
import { MenuList } from "@/types"
import { useDispatchMenu } from "@/store/hooks";


export default function Router() {
  const { stateSetMenuList } = useDispatchMenu()

  const [mergeRouterList, setMergeList] = useState<RouterInfo[]>([]);// The result of the merging of the route list returned by the local and interface
  const [ajaxUserMenuList, setAjaxUserMenuList] = useState<MenuList>([]); // A list of routes that the network requested back

  useEffect(() => {
    if (stateSetMenuList && typeof stateSetMenuList === "function") {
      getMenus().then((list) => {
        const formatList = formatMenu(list)
        const userMenus = reduceMenuList(formatList);
        // Merge the requested data with the route list exposed by the local pages page
        let routers = routerList.map((router) => {
          let find = userMenus.find((i) => (i[MENU_PARENTPATH] || "") + i[MENU_PATH] === router[MENU_PATH]);
          if (find) {
            router = { ...find, ...router }; // Local Priority Interface Results
          } else {
            router[MENU_KEY] = router[MENU_PATH];
          }
          return router;
        });
        if (list && list.length) {
          stateSetMenuList(formatList);
          setAjaxUserMenuList(userMenus);
          setMergeList(routers);
        }
      });
    }
  }, [stateSetMenuList]);


  const routerBody = useMemo(() => {
    // Listen to the local route list and render the route component when the length is greater than 1
    if (mergeRouterList.length) {
      return mergeRouterList.map((item) => {
        let { [MENU_KEY]: key, [MENU_PATH]: path } = item;
        const RenderRoute = item[MENU_KEEPALIVE] === "true" ? CacheRoute : Route;
        return (
          <RenderRoute
            key={key}
            exact={true}
            path={path}
            render={(allProps) => (
              <Intercept
                {...allProps}
                {...item}
                menuList={ajaxUserMenuList}
                pageKey={key}
              />
            )}
          />
        );
      });
    }
  }, [ajaxUserMenuList, mergeRouterList])

  return <CacheSwitch>{routerBody}</CacheSwitch>;
};