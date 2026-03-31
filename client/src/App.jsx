import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const user = localStorage.getItem("user");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <ChatPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

      </Routes>
    </Router>
  );
}

export default App;