interface Expense {
  id: number;
  category_id: number;
  category_name: string;
  price: number;
  description: string;
  profile_name: string;
  date: number; //unixepoch
}
