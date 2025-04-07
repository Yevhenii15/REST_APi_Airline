export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: Date;
  isAdmin: boolean;
}
