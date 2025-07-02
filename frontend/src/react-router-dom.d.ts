declare module 'react-router-dom' {
  export function useNavigate(): (path: string) => void;
  export function useParams<T extends Record<string, string>>(): T;
  export function Link(props: any): JSX.Element;
  export function Routes(props: any): JSX.Element;
  export function Route(props: any): JSX.Element;
  export function BrowserRouter(props: any): JSX.Element;
  export function Outlet(props: any): JSX.Element;
  export function Navigate(props: any): JSX.Element;
}
