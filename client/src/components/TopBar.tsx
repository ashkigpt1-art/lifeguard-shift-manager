import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { useAuth } from "../hooks/useAuth";

const TopBar = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Box borderBottomWidth="1px" borderColor={border} bg={bg} px={{ base: 4, md: 6 }} py={4}>
      <Flex align="center" justify="space-between">
        <Text fontSize="xl" fontWeight="semibold" color="brand.500">
          موج های آبی - مدیریت شیفت
        </Text>
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          {user && (
            <HStack spacing={3}>
              <Avatar size="sm" name={user.full_name} />
              <Box textAlign="right">
                <Text fontWeight="medium">{user.full_name}</Text>
                <Text fontSize="xs" color="gray.500">
                  نقش: {user.role}
                </Text>
              </Box>
            </HStack>
          )}
          <Button colorScheme="red" size="sm" onClick={logout}>
            خروج
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TopBar;
