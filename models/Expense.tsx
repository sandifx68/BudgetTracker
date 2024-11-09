interface Expense {
  id: number;
  category_id: number;
  category_name: string;
  profile_id: number;
  profile_name: string;
  profile_currency: string;
  price: number;
  description: string;
  date: number; //unixepoch but ISOString in database
}
