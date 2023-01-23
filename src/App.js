import "./App.css";
//import Header from "./components/Header";
import TicketList from "./components/TicketList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TicketForm from "./components/TicketForm";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TicketForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/tickets",
    element: <TicketList />,
  },
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
