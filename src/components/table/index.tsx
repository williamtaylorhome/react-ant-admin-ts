import { useEffect, useState } from "react";
import {
  Table,
  Row,
  Drawer,
  Radio,
  Tooltip,
  InputNumber,
  Button,
  message,
  notification,
} from "antd";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import MyIcon from "../icon";
import arrayMove from "array-move";
import { getKey, setKey, rmKey } from "@/utils";
import "./index.less";
import { MyTableProps, Columns, renderArugs, Column } from "./types"

const DragHandle = SortableHandle(() => (
  <MyIcon type="icon_mirrorlightctrl" className="drag-sort" />
));
const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody  {...props} />);

const setColTitle: Columns = [
  {
    title: "Column sorting",
    dataIndex: "sort",
    className: "drag-visible",
    render: () => <DragHandle />,
  },
  {
    title: "Column Name",
    dataIndex: "title",
    className: "drag-visible",
    align: "center",
  },
  {
    title: "width",
    dataIndex: "width",
    type: "inputNumber",
  },
  {
    title: "fixation",
    dataIndex: "fixed",
    width: 120,
    type: "switch",
    align: "center",
    range: [
      { v: false, t: "close" },
      { v: "left", t: "Left fixed" },
      { v: "right", t: "Right fixed" },
    ],
  },
  {
    title: "Hide beyond width",
    dataIndex: "ellipsis",
    type: "switch",
    align: "center",
    range: [
      { v: false, t: "not" },
      { v: true, t: "be" },
    ],
  },
  {
    title: "align",
    dataIndex: "align",
    type: "switch",
    align: "center",
    range: [
      { v: "left", t: "left" },
      { v: "center", t: "Center" },
      { v: "right", t: "right" },
    ],
  },
  {
    title: "hide",
    dataIndex: "hidden",
    type: "switch",
    align: "center",
    range: [
      { v: "hidden", t: "hide" },
      { v: "auto", t: "display" },
    ],
  },
];

const defaultCol: Omit<Column, "dataIndex"> = {
  width: 80,
  fixed: false,
  ellipsis: false,
  align: "left",
  hidden: "auto",
};


function UseTable(columns: Columns, saveKey: MyTableProps["saveKey"]) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [col, setCol] = useState<Columns>([]);
  const [tbTitle, setTitle] = useState<Columns>([]);
  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    const index = col.findIndex((x) => x.index === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };
  useEffect(() => {
    const data: Columns = getKey(true, saveKey || '');
    if (saveKey && data && columns && columns.length === data.length) {
      const columnInfo: any = {},
        dataInfo: any = {};
      columns.forEach((item) => (columnInfo[item.dataIndex] = item));
      data.forEach((item) => (dataInfo[item.dataIndex] = item));
      const isSameKey = Array.isArray(data)
        ? data.every((i) => i.dataIndex === columnInfo[i.dataIndex]?.dataIndex)
        : false;
      if (isSameKey) {
        // If the current table header data is the same length as the array set by the cache, the cached data will be used first
        const merge = data.map((item) => ({
          ...defaultCol,
          ...columnInfo[item.dataIndex],
          ...item,
        }));
        setCol(merge);
      } else {
        initDefaultCol();
      }
    } else if (!data && columns && columns.length !== col.length) {
      initDefaultCol()
    }
    // Eslint disable next line
  }, [saveKey, columns]);

  useEffect(() => {
    if (col.length) {
      const newTb = setColTitle.map((c) => {
        if (c.type === "switch") {
          c.render = (...args: renderArugs) => switchRender(c, ...args);
        }
        if (c.type === "inputNumber") {
          c.render = (...args) => inuputRender(c.dataIndex, ...args);
        }
        return c;
      });
      setTitle(newTb);
    }
    // Eslint disable next line
  }, [col]);

  function switchRender(column: Column, text: any, current: Column) {
    return (
      <Radio.Group
        buttonStyle="solid"
        value={text}
        onChange={(e) =>
          switchChange(column.dataIndex, e.target.value, current)
        }
      >
        {column.range &&
          column.range.map((r) => (
            <Row className="mt10" key={r.t} justify="center">
              <Tooltip title={r.t} arrowPointAtCenter>
                <Radio value={r.v}>{r.t}</Radio>
              </Tooltip>
            </Row>
          ))}
      </Radio.Group>
    );
  }
  function switchChange(key: string, val: any, current: Column) {
    const dataIndex = current.dataIndex;
    let newCol = col.map((item) => {
      if (item.dataIndex === dataIndex && key) {
        item[key] = val;
      }
      return item;
    });
    setCol(newCol);
  }

  function inuputRender(dataIndex: string, text: number, col: Column) {
    return (
      <Tooltip title="Loss of focus triggers" arrowPointAtCenter>
        <InputNumber
          min={0}
          max={800}
          onStep={(v) => switchChange(dataIndex, v, col)}
          onBlur={(v) => switchChange(dataIndex, Number(v.target.value), col)}
          value={text}
        />
      </Tooltip>
    );
  }
  function hiddin() {
    setShowDrawer(false);
  }
  function show() {
    setShowDrawer(true);
  }
  function onSortEnd({ oldIndex, newIndex }: {
    oldIndex: number
    newIndex: number
  }) {
    if (oldIndex !== newIndex) {
      const arr: Array<Columns> = []
      const newData = arrayMove(arr.concat(col), oldIndex, newIndex).filter(
        (el) => !!el
      );
      setCol(newData as unknown as Columns);
    }
  }
  function saveTbSet() {
    if (!saveKey) {
      return notification.error({
        type: "error",
        description: "You have not defined the sava key attribute of the table, please define it and save it",
        message: "Save failed",
      });
    }
    setKey(true, saveKey, col);
    message.success("Save the settings successfully!");
  }
  // Deletes the saved table display
  const delTbSet = () => {
    if (!saveKey) {
      return notification.error({
        type: "error",
        description: "You have not defined the sava key attribute of the table, please define it and click Delete after that",
        message: "Deletion failed",
      });
    }
    rmKey(true, saveKey);
    initDefaultCol();
    message.success("Deleted successfully!");
  };
  // Initialize the default format of the table
  function initDefaultCol() {
    const newCol = columns.map((c, index) => ({
      ...defaultCol,
      ...c,
      index,
    }));
    setCol(newCol);
  }
  return {
    col,
    showDrawer,
    show,
    hiddin,
    tbTitle,
    DraggableContainer,
    DraggableBodyRow,
    saveTbSet,
    delTbSet
  };
}

function MyTable({
  columns,
  dataSource,
  className,
  children,
  saveKey,
  ...Props
}: MyTableProps) {
  const {
    showDrawer,
    show,
    hiddin,
    col,
    tbTitle,
    DraggableContainer,
    DraggableBodyRow,
    saveTbSet,
    delTbSet
  } = UseTable(columns, saveKey);

  return (
    <div className="react-ant-table">
      <Row className="set" justify="end">
        <MyIcon type="icon_edit" onClick={show} />
      </Row>
      <Table
        columns={col.filter((i) => i.hidden !== "hidden")}
        dataSource={dataSource}
        className={
          className
            ? `table-show-container ${className}`
            : "table-show-container"
        }
        {...Props}
      >
        {children}
      </Table>
      <Drawer
        className="table-drawer"
        width={1000}
        onClose={hiddin}
        maskClosable={true}
        visible={showDrawer}
        title="Table display settings"
      >
        <Table
          columns={tbTitle}
          dataSource={col}
          rowKey="index"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          pagination={false}
        />
        <Row justify="center" className="mt20">
          <Button type="primary" onClick={saveTbSet}>
            Save this table setting and enable it by default the next time you open it
          </Button>
          <Button danger type="ghost" className="del" onClick={delTbSet}>
            Delete saved settings
          </Button>
        </Row>
      </Drawer>
    </div>
  );
}
export default MyTable;
