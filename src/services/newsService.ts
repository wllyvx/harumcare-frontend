import { ApiClient } from './apiClient';
import type { News, PaginatedResponse } from '../types';

export class NewsService {
  static async getAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    q?: string;
    status?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.q) queryParams.append('q', params.q);
    if (params.status) queryParams.append('status', params.status);

    const data = await ApiClient.get(`/news?${queryParams.toString()}`);
    
    return {
      news: data.news || [],
      totalNews: data.totalNews || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
    };
  }

  static async getBySlug(slug: string): Promise<News> {
    return await ApiClient.get(`/news/${slug}`);
  }

  static async getCategories() {
    return await ApiClient.get('/news/categories');
  }

  static async getTrending() {
    return await ApiClient.get('/news?limit=5&sort=views');
  }
}
