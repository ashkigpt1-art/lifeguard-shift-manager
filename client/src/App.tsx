import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TopBar from "./components/TopBar";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const bg = useColorModeValue("gray.50", "gray.900");
  const { bootstrap } = useAuth();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Flex direction="column" flex="1">
                <TopBar />
                <Box as="main" flex="1" p={{ base: 4, md: 6 }}>
                  <DashboardPage />
                </Box>
              </Flex>
            </RequireAuth>
          }
        />
      </Routes>
    </Flex>
  );
}

export default App;
