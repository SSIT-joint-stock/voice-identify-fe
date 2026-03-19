import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import VoiceSearch from "@/pages/VoiceSearch";
import VoiceEnroll from "@/pages/VoiceEnroll";
import VoiceGuide from "@/pages/VoiceGuide";
import { ROUTES } from "@/constants";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route
          path={ROUTES.VOICE}
          element={<Navigate to={ROUTES.VOICE_SEARCH} replace />}
        />
        <Route path={ROUTES.VOICE_SEARCH} element={<VoiceSearch />} />
        <Route path={ROUTES.VOICE_ENROLL} element={<VoiceEnroll />} />
        <Route path={ROUTES.VOICE_GUIDE} element={<VoiceGuide />} />
        <Route
          path={ROUTES.NOT_FOUND}
          element={<Navigate to={ROUTES.VOICE_SEARCH} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
