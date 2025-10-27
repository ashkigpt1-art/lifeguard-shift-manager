export type Role = "admin" | "manager" | "viewer";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface Task {
  id: number;
  name: string;
  description?: string | null;
  certification_required?: string | null;
}

export interface Shift {
  id: number;
  name: string;
  location: string;
  starts_at: string;
  ends_at: string;
  required_staff: number;
}

export interface ShiftAssignment {
  id: number;
  shift_id: number;
  employee_id: number;
  task_id?: number | null;
  note?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  shift: Shift;
  employee: Employee;
  task?: Task | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
