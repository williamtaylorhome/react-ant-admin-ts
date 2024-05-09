import { useCallback, useState } from "react";
import MyIcon from "../icon";
import { Button, Drawer, message, Row, Radio } from "antd";
import * as Types from "@/store/layout/actionTypes";
import { setLayoutMode, setCompVisible as util_setCompVisible } from "@/utils";
import singImg from "@/assets/images/layout2.jpg";
import twoImg from "@/assets/images/layout1.jpg";
import twoFlanksImg from "@/assets/images/layout3.jpg";
import { LayoutMode, State, LayoutModes } from "@/types"
import "./index.less";
import { useDispatchLayout, useDispatchVisible, useStateLayout, useStateVisible } from "@/store/hooks";


const modes: LayoutModes = [
  {
    img: singImg,
    mode: Types.SINGLE_COLUMN,
    alt: "Single-column layout",
  },
  {
    img: twoImg,
    mode: Types.TWO_COLUMN,
    alt: "Two-column layout",
  },
  {
    img: twoFlanksImg,
    mode: Types.TWO_FLANKS,
    alt: "Layout on both sides",
  },
];
const RadioArray = [
  {
    l: "display",
    v: true,
  },
  {
    l: "hide",
    v: false,
  },
];

function LayoutSet() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const wakeup = useCallback(() => setDrawerVisible(true), []);
  const onClose = useCallback(() => setDrawerVisible(false), []);
  const layoutMode = useStateLayout()
  const componentsVisible = useStateVisible()
  const { stateSetVisible } = useDispatchVisible()
  const { stateChangeLayout } = useDispatchLayout()
  const setLayout = useCallback((mode: LayoutMode) => {
    stateChangeLayout(mode)
    message.success("The layout is set up successfully!");
  }, [stateChangeLayout])
  const saveLayout = useCallback(() => {
    setLayoutMode(layoutMode);
    util_setCompVisible(componentsVisible);
    message.success("Layout save local success!");
  }, [layoutMode, componentsVisible])
  return (
    <div className="layoutset-container">
      <MyIcon type="icon_setting" onClick={wakeup} />
      <Drawer
        className="layoutset-drawer"
        title="Set the layout"
        placement="right"
        closable={false}
        onClose={onClose}
        width={300}
        visible={drawerVisible}
      >
        <h2 className="title">Select a layout</h2>
        <Row justify="space-around">
          {modes.map((m) => (
            <div
              key={m.mode}
              onClick={() => setLayout(m.mode)}
              className={m.mode === layoutMode ? "col active" : "col"}
            >
              <img src={m.img} alt={m.alt + m.mode + layoutMode}></img>
            </div>
          ))}
        </Row>
        <h2 className="title">Component display</h2>
        {Object.keys(componentsVisible).map((key) => (
          <Row key={key} className="visible-list">
            {key === "footer" ? "Bottom:" : "Toggle navigation at the top:"}
            <Radio.Group
              onChange={(e) => stateSetVisible(key as keyof State["componentsVisible"], e.target.value)}
              value={componentsVisible[key as keyof State["componentsVisible"]]}
            >
              {RadioArray.map((i) => (
                <Radio value={i.v} key={i.l}>
                  {i.l}
                </Radio>
              ))}
            </Radio.Group>
          </Row>
        ))}
        <Row className="save" justify="center">
          <Button type="primary" onClick={saveLayout}>
            Save this layout
          </Button>
        </Row>
      </Drawer>
    </div>
  );
}

export default LayoutSet
