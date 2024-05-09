import { Result, Button } from "antd";
import { getDefaultMenu, } from "@/utils";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { useDispatchMenu, useStateOpenedMenu } from "@/store/hooks";

interface ErrProps {
  status: 403 | 404 | 500 | '403' | '404' | '500'
  errTitle: string
  subTitle: string
  [name: string]: any
}

function useErrorPage(props: ErrProps) {
  const {
    status = "404",
    errTitle = "404",
    subTitle = "Sorry, the page you visited does not exist.",
  } = props;
  const openedMenu = useStateOpenedMenu()
  const history = useHistory()
  const { stateFilterOpenMenuKey } = useDispatchMenu()
  const back = useCallback(async () => {
    const url =
      history.location.pathname +
      (history.location.hash || history.location.search);
    // The top one or below is opened
    if (openedMenu.length <= 1) {
      stateFilterOpenMenuKey([url]);
      const defaultMenu = await getDefaultMenu();
      if (defaultMenu.openedMenu.length === 0) return history.replace("/");
      let { parentPath, path } = defaultMenu.openedMenu[0];
      history.replace(parentPath + path);
      return;
    }
    // Open the path from the top and go to jump again
    const menuList = openedMenu.filter((i) => i.path !== url);
    stateFilterOpenMenuKey([url]);
    const next = menuList[menuList.length - 1];
    history.replace(next.path);
  }, [history, openedMenu, stateFilterOpenMenuKey])
  return { status, errTitle, subTitle, back };
}

export default function ErrorPage(props: ErrProps) {
  const { status, errTitle, subTitle, back } = useErrorPage(props);
  return (
    <Result
      status={status}
      title={errTitle}
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={back}>
          Go Back
        </Button>
      }
    />
  );
}