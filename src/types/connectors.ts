export interface Email {
  id: string;
  subject: string;
  body: string;
  date: string;
  sender: string;
  recipients: string[];
  attachments?: string[];
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: string;
  end: string;
  location?: string;
  attendees: string[];
  description?: string;
}

export interface WorkHours {
  date: string;
  hoursWorked: number;
  vacation: number;
  otherAbsences: {
    type: string;
    hours: number;
  }[];
}

export interface TaskHierarchy {
  [projectName: string]: {
    tasks: string[];
    subProjects?: {
      [subProjectName: string]: string[];
    };
  };
}

export interface TimesheetEntry {
  date: string;
  project: string;
  task: string;
  hours: number;
  description?: string;
}

export interface ConnectorConfig {
  outlook?: {
    enabled: boolean;
    emailFolder?: string;
    calendarFolder?: string;
  };
  sirh?: {
    enabled: boolean;
    url: string;
    credentials?: {
      username: string;
      password: string;
    };
  };
  excel?: {
    enabled: boolean;
    craTemplatePath?: string;
    timesheetPath?: string;
  };
}

export interface ConnectorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    source: string;
    timestamp: string;
    itemsProcessed: number;
  };
} 