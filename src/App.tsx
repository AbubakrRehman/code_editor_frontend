import './App.css'
import { routes } from '../routes.tsx';
import { RouterProvider, createBrowserRouter } from "react-router";
import CodeProvider from './contexts/CodeProvider.tsx';
const router = createBrowserRouter(routes);

function App() {

  return (
    <CodeProvider>
      <RouterProvider router={router} />
    </CodeProvider>
  )
}

export default App
