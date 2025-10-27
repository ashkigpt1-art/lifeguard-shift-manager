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
  ModalOverlay
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Shift } from "../../api/types";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Shift, "id">) => Promise<void> | void;
  initialValues: Shift | null;
}

const defaultValues: Partial<Shift> = {
  name: "",
  location: "",
  starts_at: dayjs().hour(8).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
  ends_at: dayjs().hour(16).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
  required_staff: 1
};

const ShiftModal = ({ isOpen, onClose, onSubmit, initialValues }: ShiftModalProps) => {
  const { handleSubmit, register, reset } = useForm({
    defaultValues: initialValues ?? defaultValues
  });

  useEffect(() => {
    const formatted = initialValues
      ? {
          ...initialValues,
          starts_at: dayjs(initialValues.starts_at).format('YYYY-MM-DDTHH:mm'),
          ends_at: dayjs(initialValues.ends_at).format('YYYY-MM-DDTHH:mm'),
        }
      : defaultValues;
    reset(formatted);
  }, [initialValues, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialValues ? "ویرایش شیفت" : "شیفت جدید"}</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit({
              ...values,
              starts_at: dayjs(values.starts_at).toISOString(),
              ends_at: dayjs(values.ends_at).toISOString(),
              required_staff: Number(values.required_staff)
            });
          })}
        >
          <ModalBody display="grid" gap={4}>
            <FormControl isRequired>
              <FormLabel>عنوان شیفت</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>محل</FormLabel>
              <Input {...register("location", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>شروع</FormLabel>
              <Input type="datetime-local" {...register("starts_at", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>پایان</FormLabel>
              <Input type="datetime-local" {...register("ends_at", { required: true })} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>تعداد نیرو</FormLabel>
              <Input type="number" min={1} {...register("required_staff", { valueAsNumber: true })} />
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

export default ShiftModal;
