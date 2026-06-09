export type Role = 'user' | 'ong_admin' | 'ong_validator';

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};