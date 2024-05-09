# react-ant-admin(TypeScript edition)

This framework uses and secondary development, the front-end framework uses react, the UI framework uses ant-design, the global data state management uses redux, and the ajax library is axios. It is used to quickly build middle and back office pages.

- [react](https://react.dev)
- [react-router-cache-route](https://github.com/CJY0208/react-router-cache-route)
- [ant-design](https://ant.design)
- [redux](https://redux.js.org/)
- [axios](https://axios-http.com)

nodejs backend web service:[react-ant-admin-server](https://github.com/williamtaylorhome/react-ant-admin-server)

## characteristic

- Menu configuration: flat data organization, convenient for writing, inventory, page menu, title, sidebar, top navigation bar synchronization
- Page lazy loading:use [@loadable/component](https://loadable-components.com/docs/getting-started/) To solve the problem of slow opening of the page for the first time.
- Ajax request：Restful specifications, automatic error prompts, configurable prompts; automatically interrupt unfinished requests;
- Permission control: Display menus based on function types without roles, and intercept routing pages.
- Customize the theme and you can define the interface color yourself.
- Proxy forwarding solves the cross-domain problem of front-end requests.
- Routes are automatically generated and decentralized.

The system provides some basic pages

- Login page
- Details page
- form page
- List page
- authority management
- Results page


## Quick to use

1. Download this project to your local computer

2. Install dependencies

```bash
npm i
```

3. start up

```bash
npm run "start:mock" # Start local mock data (there is no background interface for now, please use this mode to preview the project)
npm run start # Start the local api interface to obtain data
```

Browser opens `http://localhost:3000` That’s it

## Create a new page

1. Create a test.js file in the src/pages folder, the code is as follows

```js
// function component
import React from "react";

export default function Test() {
  return <div>Test page</div>;
}

// class component
export default class Test extends React.Component {
  render() {
    return <div>Test page</div>;
  }
}

/**
 * The information starting with MENU_*is found in the package.json file
 *Add routing information to the pages component
 * Add route information to the prototype of the export default component, or expose a route to the outside
 * Information will be captured by webpack's webpack router generator plug-in
 */

// 1.Caught export default route on prototype
Test.route={
  [MENU_TITLE] : "Test page",
  [MENU_KEY] :  22,
  [MENU_PATH]: "/test"
}

// 2.The captured route information is given a higher priority than the above
export const route = {
  [MENU_TITLE] : "Test page",
  [MENU_KEY] : 22,
  [MENU_PATH]: "/test"
}
```

2. Browser access `http://localhost:3000/react-ant-admin/test` That’s it

## Create a menu

This addition method is suitable for `npm run "start:mock"` Started projects

1. Find the `menu` variable in `src/mock/index.js` and add a menu information to it. The code is as follows

```js
let menu = [
  {
    [MENU_TITLE]: "List page",
    [MENU_PATH]: "/list",
    [MENU_KEY]: 9,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_list",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    menu_id: 10,
    [MENU_TITLE]: "List of cards",
    [MENU_PATH]: "/card",
    [MENU_KEY]: 10,
    [MENU_PARENTKEY]: 9,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 5485,
  },
  // .... Start adding menu information ....
  {
    [MENU_TITLE]: "test", // title
    [MENU_PATH]: "/test", // Access path
    [MENU_KEY]: 22, // Unique Identification
    [MENU_PARENTKEY]: null, // The parent menu uniquely represents the null representation of the main menu rather than the submenu
    [MENU_ICON]: "icon_infopersonal", // menu icon
    [MENU_ORDER]: 1, //Menu sorting: The smaller the higher, the higher
    [MENU_KEEPALIVE]: "true", //  The page is maintained
  },
  // .....
];
```

2. Since the menu will access the local session storage `window.sessionStorage`, you need to close the current window after saving the code and reopen the address `http://localhost:3000/react-ant-admin`

> After opening it, you will find that there will be an additional `test` column in the menu. Clicking it will open the test page we created before. This completes the writing of the menu and page.

## script start

After completing the dependency installation, there are several startup methods:

- npm run start

Request interface data and return data through the background to display project information

- npm run "start:color"

Request interface data, return data through the background to display project information, and enable theme color configuration.

- npm run "start:mock"

Local simulation data, fake data to display project information

- npm run "start:mock_color"

Local simulation data, fake data to display project information, and enable theme color configuration.

- npm run build

Normal packaging mode.

- npm run "build:color"

Pack theme color. Project size will increase.

### vscode quick start project

use[vscode editor](https://code.visualstudio.com/)

Drag this project folder into the `vscode editor`, find the `npm script column` in the lower left corner and select Quick Start, no command required.