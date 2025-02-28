export interface Payment extends Document {
  payment_id: string;
  amount: number;
  payment_method: string;
  payment_date: Date;
  status: string;
}
