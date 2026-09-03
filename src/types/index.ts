export type PropertyType = 'Casa' | 'Departamento' | 'PH' | 'Local' | 'Oficina';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  agency: string;
  license: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  currency: 'USD' | 'ARS';
  bedrooms: number;
  bathrooms: number;
  area: number; // metros cuadrados
  type: PropertyType;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
  agentId: string;
  amenities: string[];
  year: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
  createdAt: string; // ISO
}

export type PublicUser = Omit<User, 'password'>;

export interface UserStats {
  propertiesViewed: number;
  favorites: number;
  searches: number;
  contactedAgents: number;
  averageBudget: number;
  monthlyViews: { label: string; value: number }[];
  typeDistribution: { label: string; value: number }[];
}

export type SortKey =
  | 'price_asc'
  | 'price_desc'
  | 'area_asc'
  | 'area_desc'
  | 'bedrooms_desc'
  | 'bathrooms_desc';

export type TypeFilter = 'Todos' | PropertyType;
