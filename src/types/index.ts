export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  neighborhood?: string;
  workplaceType: 'Híbrido' | 'Remoto' | 'Presencial';
  level: 'Júnior' | 'Pleno' | 'Sênior' | 'Lead / Especialista';
  salaryRange?: string;
  tags: string[];
  description: string;
  requirements: string[];
  postedAt: string;
  applyUrl: string;
  source: 'LinkedIn' | 'Gupy' | 'Glassdoor' | 'Indeed' | 'Greenhouse' | 'Lever';
  matchScore?: number;
  status: 'discovered' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'skipped';
  appliedDate?: string;
  appliedNotes?: string;
  notionPageId?: string;
}

export interface NotionConfig {
  apiKey: string;
  databaseId: string;
  databaseName: string;
  isConnected: boolean;
  lastSyncTime?: string;
}

export interface NotebookCell {
  id: string;
  cell_type: 'markdown' | 'code';
  title?: string;
  source: string[];
  execution_count?: number | null;
  outputs?: any[];
  explanation?: string;
}

export interface FilterState {
  searchQuery: string;
  workplaceType: string;
  level: string;
  selectedTech: string[];
  statusFilter: string;
}
