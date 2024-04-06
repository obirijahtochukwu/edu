import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Weeks from "./pages/Weeks";
import Lesson from "./pages/Lesson";
import End_of_lesson from "./pages/End_of_lesson";
import Quiz from "./pages/Quiz";
import Quiz_completed from "./pages/Quiz_completed";
import Results from "./pages/Results";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Change_password from "./pages/Change_password";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/course" element={<Lesson />} />
          <Route path="/end-of-lesson" element={<End_of_lesson />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-completed" element={<Quiz_completed />} />
          <Route path="/result" element={<Results />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<Change_password />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
