import React, { useState } from "react";
import { Input, Row, Col } from "antd";
import MyIcon from "@/components/icon";
import "./index.less";

interface IconItem {
  icon_id: string,
  name: string,
  font_class: string,
  unicode: string,
  unicode_decimal: number
}
interface MyIconItem extends IconItem {
  type: string
}
const iconData = require("@/assets/json/iconfont");
const prefix_name = iconData.css_prefix_text;
const initData: MyIconItem[] = iconData.glyphs.map((item: IconItem) => ({
  ...item,
  type: prefix_name + item.font_class,
}));

function useIcons() {
  const [icons, setIcons] = useState(initData);
  const change = (e: any) => {
    const val = e.target.value;
    if (!val || !val.replace(/\s/g, "")) {
      setIcons(initData);
      return;
    }
    const newData = initData.filter((i) => i.name.includes(val));
    setIcons(newData);
  };
  return { change, icons };
}

export default function Icons() {
  const { change, icons } = useIcons();
  return (
    <div className="icons-container">
      <h2>Icon customization</h2>
      <div className="mt10">You can use ant design's semantic vector graphics.</div>
      <div className="mt10">
        Plus, you can be at:
        <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer">
          iconfont
        </a>
        to add a custom icon，Use TEP="*" on components created with Creteflem Ekonteken
      </div>
      <Row className="mt10">
        <Col span={8}>
          <Input placeholder="Search for a library of relevant local icons" onChange={change} />
        </Col>
      </Row>
      <Row className="mt10 pd10">
        {icons.map((item: MyIconItem) => {
          return (
            <Col span={2} className="icon-item" key={item.icon_id}>
              <MyIcon type={item.type} />
              <div>{item.type}</div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

Icons.route = { [MENU_PATH]: "/icons" };