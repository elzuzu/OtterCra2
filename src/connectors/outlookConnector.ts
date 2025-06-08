import { invoke } from '@tauri-apps/api/tauri';
import { Email, CalendarEvent, ConnectorResult, ConnectorConfig } from '../types/connectors';

export class OutlookConnector {
  private config: ConnectorConfig['outlook'];

  constructor(config: ConnectorConfig['outlook']) {
    this.config = config;
  }

  async getEmails(startDate: string, endDate: string): Promise<ConnectorResult<Email[]>> {
    try {
      const emails = await invoke<Email[]>('get_outlook_emails', {
        startDate,
        endDate,
        folder: this.config?.emailFolder || 'Inbox'
      });

      return {
        success: true,
        data: emails,
        metadata: {
          source: 'outlook',
          timestamp: new Date().toISOString(),
          itemsProcessed: emails.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'outlook',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }

  async getCalendarEvents(startDate: string, endDate: string): Promise<ConnectorResult<CalendarEvent[]>> {
    try {
      const events = await invoke<CalendarEvent[]>('get_outlook_calendar_events', {
        startDate,
        endDate,
        folder: this.config?.calendarFolder || 'Calendar'
      });

      return {
        success: true,
        data: events,
        metadata: {
          source: 'outlook',
          timestamp: new Date().toISOString(),
          itemsProcessed: events.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          source: 'outlook',
          timestamp: new Date().toISOString(),
          itemsProcessed: 0
        }
      };
    }
  }
} 