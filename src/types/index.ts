export interface User {
  id: string;
  nama: string;
  username: string;
  email: string;
  nomorHp: string;
  alamat?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRef {
  title: string;
  imageUrl: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  slug: string;
  author?: {
    nama: string;
    username: string;
  };
  category: string;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  campaignId?: string | null;
  campaign?: CampaignRef | null;
  relatedCampaign?: CampaignRef | null;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  targetAmount: number;
  currentAmount: number;
  endDate: string;
  category: string;
  isFeatured: boolean;
  donationsCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
