import { invoke } from '@tauri-apps/api/tauri';
import { TaskHierarchy, TimesheetEntry, ConnectorResult, ConnectorConfig } from '../types/connectors';

export class ExcelConnector {
  private config: ConnectorConfig['excel'];

  constructor(config: ConnectorConfig['excel']) {
    this.config = config;
  }

  async readTaskHierarchy(): Promise<ConnectorResult<TaskHierarchy>> {
    try {
      const hierarchy = await invoke<TaskHierarchy>('read_cra_template', {
        filePath: this.config?.craTemplatePath
      });

      return {
        success: true,
        data: hierarchy,
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: Object.keys(hierarchy).length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }

  async readTimesheet(startDate: string, endDate: string): Promise<ConnectorResult<TimesheetEntry[]>> {
    try {
      const entries = await invoke<TimesheetEntry[]>('read_timesheet', {
        filePath: this.config?.timesheetPath,
        startDate,
        endDate
      });

      return {
        success: true,
        data: entries,
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: entries.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }

  async writeTimesheet(entries: TimesheetEntry[]): Promise<ConnectorResult<boolean>> {
    try {
      const success = await invoke<boolean>('write_timesheet', {
        filePath: this.config?.timesheetPath,
        entries
      });

      return {
        success: true,
        data: success,
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: entries.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'excel',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }
} 