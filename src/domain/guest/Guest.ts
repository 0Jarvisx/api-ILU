export interface GuestProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: GuestProps) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
