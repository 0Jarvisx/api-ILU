export type RoleName = 'guest' | 'receptionist' | 'admin';

export interface UserProps {
  id: number;
  roleId: number;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dpi?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  role?: { id: number; name: string; permissions: Array<{ id: number; name: string }> };
}

export class User {
  id: number;
  roleId: number;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  dpi: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role?: { id: number; name: string; permissions: Array<{ id: number; name: string }> };

  constructor(props: UserProps) {
    this.id = props.id;
    this.roleId = props.roleId;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.firstName = props.firstName ?? null;
    this.lastName = props.lastName ?? null;
    this.phone = props.phone ?? null;
    this.dpi = props.dpi ?? null;
    this.isActive = props.isActive;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.role = props.role;
  }

  hasRole(role: RoleName): boolean {
    return this.role?.name === role;
  }

  hasAnyRole(...roles: RoleName[]): boolean {
    return roles.some(r => this.role?.name === r);
  }
}
