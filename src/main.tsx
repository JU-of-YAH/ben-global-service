import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./styles.css";

import { Layout } from "./components/Layout";

import { Home } from "./pages/Home";
import { Vehicles } from "./pages/Vehicles";
import { VehicleDetails } from "./pages/VehicleDetails";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Sell } from './pages/Sell'

import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCarForm from "./pages/AdminCarForm";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Site public */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/vehicules"
            element={<Vehicles />}
          />

          <Route
            path="/vehicules/:slug"
            element={<VehicleDetails />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/a-propos"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />
        </Route>

        {/* Administration */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/vehicules/nouveau"
          element={<AdminCarForm />}
        />

        {/* Route inconnue */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        
        <Route path="/vendre" element={<Sell />} />
        <Route
  path="/admin/vehicules/modifier/:id"
  element={<AdminCarForm />}
/>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);