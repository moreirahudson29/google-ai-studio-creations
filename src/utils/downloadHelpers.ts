import { generateIpynbJson, generateStandalonePythonScript } from '../data/notebookContent';

export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadIpynbNotebook() {
  const jsonContent = generateIpynbJson();
  downloadFile('job_application_tracker_agent.ipynb', jsonContent, 'application/x-ipynb+json');
}

export function downloadPythonScript() {
  const scriptContent = generateStandalonePythonScript();
  downloadFile('agent.py', scriptContent, 'text/x-python');
}

export function downloadWorkflowYml() {
  const yml = `name: Daily São Paulo Data Jobs Search
on:
  schedule:
    # 08:00 AM São Paulo time (11:00 UTC) Mon-Fri
    - cron: '0 11 * * 1-5'
  workflow_dispatch:

jobs:
  daily-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install requests
      - name: Run daily search
        env:
          NOTION_API_KEY: \${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: \${{ secrets.NOTION_DATABASE_ID }}
          RAPIDAPI_KEY: \${{ secrets.RAPIDAPI_KEY }}
        run: python agent.py search
`;
  downloadFile('daily_job_search.yml', yml, 'text/yaml');
}

export function downloadEnvTemplate() {
  const envContent = `# Notion Integration Credentials
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Job Search Provider (Optional: RapidAPI JSearch for LinkedIn/Glassdoor/Indeed)
RAPIDAPI_KEY=your_rapidapi_key_here

# São Paulo Target Settings
SEARCH_QUERY="Data Analytics" OR "Analista de Dados"
SEARCH_LOCATION=São Paulo, Brazil
`;
  downloadFile('.env.example', envContent, 'text/plain');
}
