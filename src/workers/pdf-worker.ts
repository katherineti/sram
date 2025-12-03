import { generateSchoolReport } from '@/lib/pdf-generator';
import { School, Athlete } from '@/lib/mock-data';

self.onmessage = (event: MessageEvent<{ school: School, athletes: Athlete[] }>) => {
  const { school, athletes } = event.data;
  
  try {
    const pdfBlob = generateSchoolReport(school, athletes);
    self.postMessage(pdfBlob);
  } catch (error) {
    console.error('Error in PDF worker:', error);
    // Optionally, post an error message back to the main thread
    // self.postMessage({ error: 'Failed to generate PDF' });
  }
};
