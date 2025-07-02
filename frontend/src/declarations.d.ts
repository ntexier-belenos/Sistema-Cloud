// Declaration file for modules without TypeScript definitions

declare module 'react-dom/client' {
    
  export function createRoot(container: Element | null): {
    render: (element: React.ReactNode) => void;
    unmount: () => void;
  };
}
