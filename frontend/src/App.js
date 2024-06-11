import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPasword";
import Reset from "./pages/auth/Reset";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
                <Login />
            } />
          <Route
            path="/register"
            element={
                <Register />
            } />
          <Route
            path="/forgot"
            element={
                <ForgotPassword />
            } />
          <Route
            path="/resetPassword/:resetToken"
            element={
                <Reset />
            } />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
