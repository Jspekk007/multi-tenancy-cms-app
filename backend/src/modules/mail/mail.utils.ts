import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { convert } from 'html-to-text';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderTemplate = async <T extends Record<string, unknown>>(
  templateName: string,
  context: T,
): Promise<{ html: string; text: string }> => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  const htmlRaw = await fs.readFile(templatePath, 'utf-8');
  const html = handlebars.compile(htmlRaw)(context);

  const text = convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
    ],
  });

  return { html, text };
};
