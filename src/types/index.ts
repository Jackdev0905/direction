export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken(accessToken: any): unknown;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export enum Category {
  NOTICE = 'NOTICE',
  QNA = 'QNA',
  FREE = 'FREE'
}

export enum SortField {
  CREATED_AT = 'createdAt',
  TITLE = 'title'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface User {
  id: string;
  email: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}

export interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags: string[];
}

export interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}

export interface PostListResponse {
  items: Post[];
  total: number;
  nextCursor?: string | null;
  prevCursor?: string | null;
  hasNext?: boolean; 
  hasPrev?: boolean; 
}

export interface PostSearchParams {
  cursor?: string;
  limit?: number;
  sort?: SortField;
  order?: SortOrder;
  category?: Category;
  search?: string;
  from?: string;
  to?: string;
  nextCursor?: string;  
  prevCursor?: string;  
}

export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

export interface WeeklyMoodItem {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface CoffeeDataPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeam {
  team: string;
  series: CoffeeDataPoint[];
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

export interface DeleteResponse {
  ok: boolean;
  deleted: number;
}

