export interface PermissionProps {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
}

export class Permission {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;

  constructor(props: PermissionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
  }
}
