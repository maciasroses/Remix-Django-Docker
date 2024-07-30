export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  users: User[];
  categories: Category[];
  location: Location;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}
