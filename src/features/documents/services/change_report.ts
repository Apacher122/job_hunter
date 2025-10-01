import * as fs from 'fs';

import paths from '../../../shared/constants/paths.js';
import { sectionFormatters } from '../../../shared/utils/formatters/resume.formatter.js'

export const generateChangeReport = (response: any) => {
  const changeReportPath = paths.paths.changeReport;

  let content = '';
  Object.entries(sectionFormatters).forEach(([section, formatter]) => {
    if (response[section]) {
      content += formatter(response[section]);
    }
  });
  fs.appendFileSync(changeReportPath, content);
}
      