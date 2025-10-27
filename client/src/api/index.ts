import api from "./client";
import { Employee, LoginResponse, Role, Shift, ShiftAssignment, Task, User } from "./types";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  params.append("grant_type", "password");

  const { data } = await api.post<LoginResponse>("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const fetchCurrentUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get<Employee[]>("/employees");
  return data;
};

export const createEmployee = async (payload: Omit<Employee, "id">): Promise<Employee> => {
  const { data } = await api.post<Employee>("/employees", payload);
  return data;
};

export const updateEmployee = async (id: number, payload: Omit<Employee, "id">): Promise<Employee> => {
  const { data } = await api.put<Employee>(`/employees/${id}`, payload);
  return data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
};

export const createTask = async (payload: Omit<Task, "id">): Promise<Task> => {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
};

export const updateTask = async (id: number, payload: Omit<Task, "id">): Promise<Task> => {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const fetchShifts = async (): Promise<Shift[]> => {
  const { data } = await api.get<Shift[]>("/shifts");
  return data;
};

export const createShift = async (payload: Omit<Shift, "id">): Promise<Shift> => {
  const { data } = await api.post<Shift>("/shifts", payload);
  return data;
};

export const updateShift = async (id: number, payload: Omit<Shift, "id">): Promise<Shift> => {
  const { data } = await api.put<Shift>(`/shifts/${id}`, payload);
  return data;
};

export const deleteShift = async (id: number): Promise<void> => {
  await api.delete(`/shifts/${id}`);
};

export const fetchAssignments = async (): Promise<ShiftAssignment[]> => {
  const { data } = await api.get<ShiftAssignment[]>("/assignments");
  return data;
};

export const createAssignment = async (
  payload: Omit<ShiftAssignment, "id" | "shift" | "employee" | "task">
): Promise<ShiftAssignment> => {
  const { data } = await api.post<ShiftAssignment>("/assignments", payload);
  return data;
};

export const updateAssignment = async (
  id: number,
  payload: Partial<Omit<ShiftAssignment, "id" | "shift" | "employee" | "task">>
): Promise<ShiftAssignment> => {
  const { data } = await api.patch<ShiftAssignment>(`/assignments/${id}`, payload);
  return data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await api.delete(`/assignments/${id}`);
};

export const exportAssignments = async (): Promise<Blob> => {
  const response = await api.get("/reports/assignments.csv", { responseType: "blob" });
  return response.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/auth/users");
  return data;
};

export const createUser = async (
  payload: { email: string; full_name: string; role: Role; password: string }
): Promise<User> => {
  const { data } = await api.post<User>("/auth/users", payload);
  return data;
};
