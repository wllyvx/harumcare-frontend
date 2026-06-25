import { ApiClient } from './apiClient';
import type { Campaign } from '../types';

export class CampaignService {
  static async getAll(params: {
    page?: number;
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const data = await ApiClient.get(`/campaigns?${queryParams.toString()}`);
    
    return {
      campaigns: data.campaigns || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      total: data.total || 0,
    };
  }

  static async getBySlug(slug: string): Promise<Campaign> {
    return await ApiClient.get(`/campaigns/${slug}`);
  }

  static async getLatest(limit: number = 3) {
    return await this.getAll({ limit });
  }
}
