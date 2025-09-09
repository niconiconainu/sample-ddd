import { Injectable } from '@nestjs/common';

export interface ExternalUserData {
  externalId: string;
  name: string;
  email: string;
  registeredAt: string;
}

@Injectable()
export class ExternalApiClient {
  private mockData: ExternalUserData[] = [
    {
      externalId: 'ext-001',
      name: 'John Doe',
      email: 'john@example.com',
      registeredAt: '2023-01-01T00:00:00Z'
    },
    {
      externalId: 'ext-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      registeredAt: '2023-02-01T00:00:00Z'
    }
  ];

  async fetchUserData(externalId: string): Promise<ExternalUserData | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const user = this.mockData.find(u => u.externalId === externalId);
    return user || null;
  }

  async fetchAllUsers(): Promise<ExternalUserData[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return this.mockData;
  }

  async syncUserData(userData: {
    name: string;
    email: string;
  }): Promise<{ success: boolean; externalId?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Mock successful sync
    const externalId = `ext-${Date.now()}`;
    this.mockData.push({
      externalId,
      name: userData.name,
      email: userData.email,
      registeredAt: new Date().toISOString()
    });

    return {
      success: true,
      externalId
    };
  }
}