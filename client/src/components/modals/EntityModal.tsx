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
  Textarea
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Employee, Task } from "../../api/types";

interface EntityModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
  initialValues: Employee | Task | null;
  type: "employee" | "task";
}

const EntityModal = ({ title, isOpen, onClose, onSubmit, initialValues, type }: EntityModalProps) => {
  const { handleSubmit, register, reset } = useForm({ defaultValues: initialValues ?? {} });

  useEffect(() => {
    reset(initialValues ?? {});
  }, [initialValues, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <ModalBody display="grid" gap={4}>
            <FormControl isRequired>
              <FormLabel>{type === "employee" ? "نام" : "عنوان وظیفه"}</FormLabel>
              <Input {...register(type === "employee" ? "first_name" : "name", { required: true })} />
            </FormControl>
            {type === "employee" && (
              <>
                <FormControl isRequired>
                  <FormLabel>نام خانوادگی</FormLabel>
                  <Input {...register("last_name", { required: true })} />
                </FormControl>
                <FormControl>
                  <FormLabel>سمت</FormLabel>
                  <Input {...register("position")} />
                </FormControl>
                <FormControl>
                  <FormLabel>شماره تماس</FormLabel>
                  <Input {...register("phone")} />
                </FormControl>
                <FormControl>
                  <FormLabel>توضیحات</FormLabel>
                  <Textarea {...register("notes")} rows={3} />
                </FormControl>
              </>
            )}
            {type === "task" && (
              <>
                <FormControl>
                  <FormLabel>توضیحات</FormLabel>
                  <Textarea {...register("description")} rows={3} />
                </FormControl>
                <FormControl>
                  <FormLabel>نیازمندی</FormLabel>
                  <Input {...register("certification_required")} />
                </FormControl>
              </>
            )}
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

export default EntityModal;
