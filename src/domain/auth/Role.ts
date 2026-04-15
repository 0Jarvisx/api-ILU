export interface RoleProps {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
  permissions?: Array<{ id: number; name: string }>;
}

export class Role {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  permissions?: Array<{ id: number; name: string }>;

  constructor(props: RoleProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.permissions = props.permissions;
  }
}
