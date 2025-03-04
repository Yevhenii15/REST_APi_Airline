export interface User extends Document {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: Date;
  isAdmin: boolean;
}
