declare const SRC: string

declare module "inline:*" {
    const content: string
    export default content
}

declare module "*.scss" {
    const content: string
    export default content
}

declare module "*.blp" {
    const content: string
    export default content
}

declare module "*.css" {
    const content: string
    export default content
}

declare module 'astal';
declare module 'astal/gtk3';
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: string | number): any;
  export function jsxs(type: any, props: any, key?: string | number): any;
  export const Fragment: any;
}

declare module 'astal/gtk3/jsx-runtime' {
  export { jsx, jsxs, Fragment } from 'react/jsx-runtime';
}

declare module 'gi://*';
