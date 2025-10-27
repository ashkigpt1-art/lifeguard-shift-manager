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
  Select,
  Textarea
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Employee, Shift, ShiftAssignment, Task } from "../../api/types";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    values: Omit<ShiftAssignment, "id" | "shift" | "employee" | "task">
  ) => Promise<void> | void;
  initialValues: ShiftAssignment | null;
  employees: Employee[];
  tasks: Task[];
  shifts: Shift[];
}

const AssignmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  employees,
  tasks,
  shifts
}: AssignmentModalProps) => {
  const { handleSubmit, register, reset } = useForm({ defaultValues: {} });

  useEffect(() => {
    const formatted = initialValues
      ? {
          employee_id: initialValues.employee_id.toString(),
          shift_id: initialValues.shift_id.toString(),
          task_id: initialValues.task_id ? initialValues.task_id.toString() : '',
          note: initialValues.note ?? '',
          check_in_time: initialValues.check_in_time ?? '',
          check_out_time: initialValues.check_out_time ?? ''
        }
      : {
          employee_id: '',
          shift_id: '',
          task_id: '',
          note: '',
          check_in_time: '',
          check_out_time: ''
        };
    reset(formatted);
  }, [initialValues, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialValues ? "ویرایش تخصیص" : "تخصیص جدید"}</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit({
              shift_id: Number(values.shift_id),
              employee_id: Number(values.employee_id),
              task_id: values.task_id ? Number(values.task_id) : undefined,
              note: values.note || undefined,
              check_in_time: values.check_in_time || undefined,
              check_out_time: values.check_out_time || undefined
            });
          })}
        >
          <ModalBody display="grid" gap={4}>
            <FormControl isRequired>
              <FormLabel>پرسنل</FormLabel>
              <Select {...register("employee_id", { required: true })}>
                <option value="">انتخاب کنید</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>شیفت</FormLabel>
              <Select {...register("shift_id", { required: true })}>
                <option value="">انتخاب کنید</option>
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>وظیفه</FormLabel>
              <Select {...register("task_id")}>
                <option value="">انتخاب کنید</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>یادداشت</FormLabel>
              <Textarea {...register("note")} rows={3} />
            </FormControl>
            <FormControl>
              <FormLabel>ساعت حضور</FormLabel>
              <Input type="time" {...register("check_in_time")} />
            </FormControl>
            <FormControl>
              <FormLabel>ساعت ترک</FormLabel>
              <Input type="time" {...register("check_out_time")} />
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

export default AssignmentModal;
