declare module "react-dom/client" {
  export const createRoot: (el: Element) => { render: (node: React.ReactNode) => void; unmount: () => void };
}
