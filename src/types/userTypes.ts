export interface User {
  name: String;
  email: String;
  password: String;
  role: UserRole;
}

export enum UserRole {
  CARETAKER,
  CAREGIVER,
  ADMIN,
}
