import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@wavepark.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      toast({ title: "خوش آمدید", status: "success" });
    } catch (error) {
      toast({ title: "ورود ناموفق بود", status: "error" });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, brand.100, brand.300)">
      <Card w={{ base: "90%", sm: "420px" }} shadow="xl" bg={cardBg} borderRadius="2xl">
        <CardBody p={8}>
          <Heading size="md" textAlign="center" mb={6}>
            مدیریت شیفت موج های آبی
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>ایمیل سازمانی</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} size="lg" />
            </FormControl>
            <FormControl mb={6} isRequired>
              <FormLabel>رمز عبور</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h="full">
                  <Button variant="ghost" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button colorScheme="brand" type="submit" w="full" size="lg" isLoading={loading}>
              ورود
            </Button>
          </form>
          <Text fontSize="sm" color="gray.500" textAlign="center" mt={6}>
            برای اولین ورود از اطلاعات پیش فرض استفاده کنید و سپس رمز را از طریق بخش کاربران تغییر دهید.
          </Text>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default LoginPage;
