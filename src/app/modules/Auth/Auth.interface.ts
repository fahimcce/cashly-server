export type TUserRole = "admin" | "user" | "agent";

export type TUser = {
  name: string;
  password: string;
  phone: string;
  email: string;
  role: TUserRole;
  nid: string;
  isDeleted: boolean;
  balance: number;
  pin?: string;
  income?: number;
  isApproved: boolean;
};

export type Tlogin = {
  identifier: string;
  password: string;
};
