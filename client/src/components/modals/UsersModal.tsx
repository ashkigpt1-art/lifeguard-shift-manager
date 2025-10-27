import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { Role } from "../../api/types";

interface UserForm {
  full_name: string;
  email: string;
  role: Role;
  password: string;
}

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserForm) => Promise<void> | void;
}

const UsersModal = ({ isOpen, onClose, onSubmit }: UsersModalProps) => {
  const { register, handleSubmit, reset } = useForm<UserForm>({
    defaultValues: { full_name: "", email: "", role: "manager", password: "" }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>کاربر جدید</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
            reset();
            onClose();
          })}
        >
          <ModalBody display="grid" gap={4}>
            <FormControl isRequired>
              <FormLabel>نام و نام خانوادگی</FormLabel>
              <Input {...register("full_name", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>ایمیل</FormLabel>
              <Input type="email" {...register("email", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>نقش</FormLabel>
              <Select {...register("role", { required: true })}>
                <option value="admin">مدیرکل</option>
                <option value="manager">مدیر</option>
                <option value="viewer">مشاهده</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>رمز عبور موقت</FormLabel>
              <Input type="password" {...register("password", { required: true })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} variant="ghost">
              انصراف
            </Button>
            <Button colorScheme="brand" type="submit">
              ذخیره
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UsersModal;
