import { User } from "@auth/interfaces/user.interface";



export interface ProductResponse {
  count: number;
  pages: number;
  products: Product[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  images: string[];
  user: User;
}

export enum Gender {
  Kid = 'kid',
  Men = 'men',
  Unisex = 'unisex',
  Women = 'women',
}

export enum Size {
  L = 'L',
  M = 'M',
  S = 'S',
  XS = 'XS',
  XL = 'XL',
  XXL = 'XXL',
}

export const DEFAULT_EMPTY_PRODUCT_ID = 'new';

export const emptyProduct: Product = {
  id: DEFAULT_EMPTY_PRODUCT_ID,
  description: '',
  gender: Gender.Men,
  images: [''],
  price: 0,
  sizes: [],
  slug: '',
  stock: 0,
  tags: [],
  title: '',
  user: {} as User,
};