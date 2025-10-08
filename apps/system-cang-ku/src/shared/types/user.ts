import { Role } from './enums';

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: Role;
  register_date: string;
  active: boolean;
}
