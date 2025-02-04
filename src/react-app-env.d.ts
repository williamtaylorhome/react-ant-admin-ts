/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly showColorSet: boolean
    readonly varColors: { [key: string]: string }[]
  }
}
declare namespace globalThis {
  interface Window {
    less: {
      modifyVars: (s: { [key: string]: string }) => Promise<any>
    };
    __REDUX_DEVTOOLS_EXTENSION__: () => any
  }
  // In line with Pacac. Ethan Menou hit him
  const MENU_PATH = "path"
  const MENU_SHOW = "show"
  const MENU_KEEPALIVE = "keep_alive"
  const MENU_KEY = "key"
  const MENU_ICON = "icon"
  const MENU_TITLE = "title"
  const MENU_CHILDREN = "children"
  const MENU_PARENTKEY = "parent_m_id"
  const MENU_ALLPATH = "allPath"
  const MENU_PARENTPATH = "parentPath"
  const MENU_ORDER = "order"
}
declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
