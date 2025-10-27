import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon, DownloadIcon, RepeatClockIcon, SettingsIcon, ViewIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

import {
  createAssignment,
  createEmployee,
  createShift,
  createTask,
  createUser,
  deleteAssignment,
  deleteEmployee,
  deleteShift,
  deleteTask,
  exportAssignments,
  fetchAssignments,
  fetchEmployees,
  fetchShifts,
  fetchTasks,
  fetchUsers,
  updateEmployee,
  updateShift,
  updateTask
} from "../api";
import { Employee, Shift, ShiftAssignment, Task, User } from "../api/types";
import { useAuth } from "../hooks/useAuth";
import EntityModal from "../components/modals/EntityModal";
import ShiftModal from "../components/modals/ShiftModal";
import AssignmentModal from "../components/modals/AssignmentModal";
import UsersModal from "../components/modals/UsersModal";

const DashboardPage = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<ShiftAssignment | null>(null);

  const employeeModal = useDisclosure();
  const taskModal = useDisclosure();
  const shiftModal = useDisclosure();
  const assignmentModal = useDisclosure();
  const usersModal = useDisclosure();

  const canManage = user?.role === "admin" || user?.role === "manager";
  const canAdmin = user?.role === "admin";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [employeeData, taskData, shiftData, assignmentData] = await Promise.all([
        fetchEmployees(),
        fetchTasks(),
        fetchShifts(),
        fetchAssignments()
      ]);
      setEmployees(employeeData);
      setTasks(taskData);
      setShifts(shiftData);
      setAssignments(assignmentData);
      if (canAdmin) {
        const userData = await fetchUsers();
        setUsers(userData);
      }
    } catch (error) {
      toast({ title: "خطا", description: "بارگذاری اطلاعات با مشکل مواجه شد.", status: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast, canAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalHours = useMemo(() => {
    return shifts.reduce((sum, shift) => {
      const start = dayjs(shift.starts_at);
      const end = dayjs(shift.ends_at);
      return sum + end.diff(start, "hour", true);
    }, 0);
  }, [shifts]);

  const upcomingShift = useMemo(() => {
    const future = shifts.filter((shift) => dayjs(shift.starts_at).isAfter(dayjs()))
      .sort((a, b) => dayjs(a.starts_at).valueOf() - dayjs(b.starts_at).valueOf());
    return future[0];
  }, [shifts]);

  const handleExport = async () => {
    try {
      const blob = await exportAssignments();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "assignments.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "گزارش دانلود شد", status: "success" });
    } catch (error) {
      toast({ title: "دانلود گزارش ناموفق بود", status: "error" });
    }
  };

  const quickStats = [
    {
      icon: CalendarIcon,
      label: "تعداد شیفت ها",
      value: shifts.length,
      accent: "brand.500"
    },
    {
      icon: RepeatClockIcon,
      label: "ساعت پوشش",
      value: `${Math.round(totalHours)}h`,
      accent: "purple.500"
    },
    {
      icon: ViewIcon,
      label: "نیروهای فعال",
      value: employees.length,
      accent: "green.500"
    },
    {
      icon: SettingsIcon,
      label: "وظایف تعریف شده",
      value: tasks.length,
      accent: "orange.500"
    }
  ];

  const handleEmployeeSubmit = async (payload: Omit<Employee, "id">) => {
    try {
      if (activeEmployee) {
        const updated = await updateEmployee(activeEmployee.id, payload);
        setEmployees((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "پرسنل بروزرسانی شد", status: "success" });
      } else {
        const created = await createEmployee(payload);
        setEmployees((prev) => [...prev, created]);
        toast({ title: "پرسنل جدید اضافه شد", status: "success" });
      }
    } catch (error) {
      toast({ title: "ذخیره پرسنل ناموفق بود", status: "error" });
    } finally {
      employeeModal.onClose();
      setActiveEmployee(null);
    }
  };

  const handleTaskSubmit = async (payload: Omit<Task, "id">) => {
    try {
      if (activeTask) {
        const updated = await updateTask(activeTask.id, payload);
        setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "وظیفه بروزرسانی شد", status: "success" });
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [...prev, created]);
        toast({ title: "وظیفه جدید اضافه شد", status: "success" });
      }
    } catch (error) {
      toast({ title: "ذخیره وظیفه ناموفق بود", status: "error" });
    } finally {
      taskModal.onClose();
      setActiveTask(null);
    }
  };

  const handleShiftSubmit = async (payload: Omit<Shift, "id">) => {
    try {
      if (activeShift) {
        const updated = await updateShift(activeShift.id, payload);
        setShifts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "شیفت بروزرسانی شد", status: "success" });
      } else {
        const created = await createShift(payload);
        setShifts((prev) => [...prev, created]);
        toast({ title: "شیفت جدید ثبت شد", status: "success" });
      }
    } catch (error) {
      toast({ title: "ذخیره شیفت ناموفق بود", status: "error" });
    } finally {
      shiftModal.onClose();
      setActiveShift(null);
    }
  };

  const handleAssignmentSubmit = async (
    payload: Omit<ShiftAssignment, "id" | "shift" | "employee" | "task">
  ) => {
    try {
      if (activeAssignment) {
        const updated = await updateAssignment(activeAssignment.id, payload);
        setAssignments((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast({ title: "تخصیص بروزرسانی شد", status: "success" });
      } else {
        const created = await createAssignment(payload);
        setAssignments((prev) => [...prev, created]);
        toast({ title: "تخصیص جدید ایجاد شد", status: "success" });
      }
    } catch (error) {
      toast({ title: "ذخیره تخصیص ناموفق بود", status: "error" });
    } finally {
      assignmentModal.onClose();
      setActiveAssignment(null);
    }
  };

  const removeEmployee = async (id: number) => {
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "پرسنل حذف شد", status: "success" });
    } catch (error) {
      toast({ title: "حذف پرسنل ناموفق بود", status: "error" });
    }
  };

  const removeTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "وظیفه حذف شد", status: "success" });
    } catch (error) {
      toast({ title: "حذف وظیفه ناموفق بود", status: "error" });
    }
  };

  const removeShift = async (id: number) => {
    try {
      await deleteShift(id);
      setShifts((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "شیفت حذف شد", status: "success" });
    } catch (error) {
      toast({ title: "حذف شیفت ناموفق بود", status: "error" });
    }
  };

  const removeAssignment = async (id: number) => {
    try {
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "تخصیص حذف شد", status: "success" });
    } catch (error) {
      toast({ title: "حذف تخصیص ناموفق بود", status: "error" });
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="60vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        {quickStats.map((stat) => (
          <Card key={stat.label} borderTopWidth="4px" borderTopColor={stat.accent}>
            <CardBody>
              <HStack spacing={3} align="flex-start">
                <Icon as={stat.icon} boxSize={6} color={stat.accent} />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {stat.label}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {upcomingShift && (
        <Card>
          <CardBody>
            <Heading size="md" mb={2}>
              نزدیک ترین شیفت
            </Heading>
            <Text fontWeight="medium">{upcomingShift.name}</Text>
            <Text color="gray.500">
              {dayjs(upcomingShift.starts_at).format("DD MMM YYYY - HH:mm")} تا {" "}
              {dayjs(upcomingShift.ends_at).format("HH:mm")}
            </Text>
            <Text mt={2}>محل: {upcomingShift.location}</Text>
          </CardBody>
        </Card>
      )}

      <Tabs colorScheme="brand" variant="enclosed">
        <TabList flexWrap="wrap">
          <Tab>پرسنل</Tab>
          <Tab>وظایف</Tab>
          <Tab>شیفت ها</Tab>
          <Tab>تخصیص ها</Tab>
          {canAdmin && <Tab>کاربران سامانه</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">لیست پرسنل</Heading>
              {canManage && (
                <Button
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setActiveEmployee(null);
                    employeeModal.onOpen();
                  }}
                  colorScheme="brand"
                >
                  افزودن پرسنل
                </Button>
              )}
            </Flex>
            <EntityModal
              title={activeEmployee ? "ویرایش پرسنل" : "پرسنل جدید"}
              isOpen={employeeModal.isOpen}
              onClose={() => {
                employeeModal.onClose();
                setActiveEmployee(null);
              }}
              initialValues={activeEmployee}
              onSubmit={handleEmployeeSubmit}
              type="employee"
            />
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
              {employees.map((employee) => (
                <Card key={employee.id} _hover={{ shadow: "md" }}>
                  <CardBody>
                    <Heading size="sm">
                      {employee.first_name} {employee.last_name}
                    </Heading>
                    <Text color="gray.500" mt={1}>
                      {employee.position ?? "بدون عنوان"}
                    </Text>
                    <Text mt={2} fontSize="sm">
                      تماس: {employee.phone ?? "نامشخص"}
                    </Text>
                    <Text mt={2} fontSize="sm" noOfLines={2}>
                      توضیحات: {employee.notes ?? "-"}
                    </Text>
                    {canManage && (
                      <HStack mt={4} spacing={2}>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveEmployee(employee);
                            employeeModal.onOpen();
                          }}
                        >
                          ویرایش
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => removeEmployee(employee.id)}>
                          حذف
                        </Button>
                      </HStack>
                    )}
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">وظایف و مهارت ها</Heading>
              {canManage && (
                <Button
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setActiveTask(null);
                    taskModal.onOpen();
                  }}
                  colorScheme="brand"
                >
                  افزودن وظیفه
                </Button>
              )}
            </Flex>
            <EntityModal
              title={activeTask ? "ویرایش وظیفه" : "وظیفه جدید"}
              isOpen={taskModal.isOpen}
              onClose={() => {
                taskModal.onClose();
                setActiveTask(null);
              }}
              initialValues={activeTask}
              onSubmit={handleTaskSubmit}
              type="task"
            />
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardBody>
                    <Heading size="sm">{task.name}</Heading>
                    <Text mt={2}>{task.description ?? "بدون توضیح"}</Text>
                    <Text mt={2} fontSize="sm" color="gray.500">
                      نیازمندی: {task.certification_required ?? "ندارد"}
                    </Text>
                    {canManage && (
                      <HStack mt={4} spacing={2}>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveTask(task);
                            taskModal.onOpen();
                          }}
                        >
                          ویرایش
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => removeTask(task.id)}>
                          حذف
                        </Button>
                      </HStack>
                    )}
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">برنامه شیفت ها</Heading>
              {canManage && (
                <Button
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setActiveShift(null);
                    shiftModal.onOpen();
                  }}
                  colorScheme="brand"
                >
                  افزودن شیفت
                </Button>
              )}
            </Flex>
            <ShiftModal
              isOpen={shiftModal.isOpen}
              onClose={() => {
                shiftModal.onClose();
                setActiveShift(null);
              }}
              onSubmit={handleShiftSubmit}
              initialValues={activeShift}
            />
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {shifts.map((shift) => (
                <Card key={shift.id}>
                  <CardBody>
                    <Heading size="sm">{shift.name}</Heading>
                    <Text color="gray.500" mt={1}>
                      {shift.location}
                    </Text>
                    <Text mt={2}>
                      {dayjs(shift.starts_at).format("DD MMM - HH:mm")} تا {" "}
                      {dayjs(shift.ends_at).format("HH:mm")}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      نیاز به {shift.required_staff} نفر
                    </Text>
                    {canManage && (
                      <HStack mt={4} spacing={2}>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveShift(shift);
                            shiftModal.onOpen();
                          }}
                        >
                          ویرایش
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => removeShift(shift.id)}>
                          حذف
                        </Button>
                      </HStack>
                    )}
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">تخصیص ها</Heading>
              {canManage && (
                <Button
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setActiveAssignment(null);
                    assignmentModal.onOpen();
                  }}
                  colorScheme="brand"
                >
                  تخصیص جدید
                </Button>
              )}
              <Button leftIcon={<DownloadIcon />} onClick={handleExport} variant="outline">
                خروجی CSV
              </Button>
            </Flex>
            <AssignmentModal
              isOpen={assignmentModal.isOpen}
              onClose={() => {
                assignmentModal.onClose();
                setActiveAssignment(null);
              }}
              onSubmit={handleAssignmentSubmit}
              initialValues={activeAssignment}
              employees={employees}
              tasks={tasks}
              shifts={shifts}
            />
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardBody>
                    <Heading size="sm">{assignment.employee.first_name} {assignment.employee.last_name}</Heading>
                    <Text mt={2}>
                      شیفت: {assignment.shift.name} ({dayjs(assignment.shift.starts_at).format("DD MMM HH:mm")})
                    </Text>
                    <Text mt={2}>وظیفه: {assignment.task?.name ?? "ندارد"}</Text>
                    {assignment.note && (
                      <Text mt={2} fontSize="sm" color="gray.500">
                        یادداشت: {assignment.note}
                      </Text>
                    )}
                    {canManage && (
                      <HStack mt={4} spacing={2}>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveAssignment(assignment);
                            assignmentModal.onOpen();
                          }}
                        >
                          ویرایش
                        </Button>
                        <Button size="sm" colorScheme="red" onClick={() => removeAssignment(assignment.id)}>
                          حذف
                        </Button>
                      </HStack>
                    )}
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </TabPanel>

          {canAdmin && (
            <TabPanel>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">کاربران سامانه</Heading>
                <Button leftIcon={<AddIcon />} onClick={usersModal.onOpen} colorScheme="brand">
                  کاربر جدید
                </Button>
              </Flex>
              <UsersModal
                isOpen={usersModal.isOpen}
                onClose={usersModal.onClose}
                onSubmit={async (payload) => {
                  try {
                    const created = await createUser(payload);
                    setUsers((prev) => [...prev, created]);
                    toast({ title: "کاربر جدید ایجاد شد", status: "success" });
                  } catch (error) {
                    toast({ title: "ایجاد کاربر ناموفق بود", status: "error" });
                  }
                }}
              />
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                {users.map((userItem) => (
                  <Card key={userItem.id}>
                    <CardBody>
                      <Heading size="sm">{userItem.full_name}</Heading>
                      <Text mt={2}>{userItem.email}</Text>
                      <Text fontSize="sm" color="gray.500">
                        نقش: {userItem.role}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default DashboardPage;
