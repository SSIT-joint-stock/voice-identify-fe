import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Voice from "@/pages/Voice";
import { ROUTES } from "@/constants";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.VOICE} element={<Voice />} />
        <Route
          path={ROUTES.NOT_FOUND}
          element={<Navigate to={ROUTES.VOICE} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
