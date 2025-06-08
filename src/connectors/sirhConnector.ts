import { invoke } from '@tauri-apps/api/tauri';
import { WorkHours, ConnectorResult, ConnectorConfig } from '../types/connectors';

export class SirhConnector {
  private config: ConnectorConfig['sirh'];

  constructor(config: ConnectorConfig['sirh']) {
    this.config = config;
  }

  async getWorkHours(startDate: string, endDate: string): Promise<ConnectorResult<WorkHours[]>> {
    try {
      const workHours = await invoke<WorkHours[]>('get_sirh_work_hours', {
        startDate,
        endDate,
        url: this.config?.url,
        credentials: this.config?.credentials
      });

      return {
        success: true,
        data: workHours,
        metadata: {
          source: 'sirh',
          timestamp: new Date().toISOString(),
          itemsProcessed: workHours.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'sirh',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }

  async validateCredentials(): Promise<ConnectorResult<boolean>> {
    try {
      const isValid = await invoke<boolean>('validate_sirh_credentials', {
        url: this.config?.url,
        credentials: this.config?.credentials
      });

      return {
        success: true,
        data: isValid,
        metadata: {
          source: 'sirh',
          timestamp: new Date().toISOString(),
          itemsProcessed: 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'sirh',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }
} 