import fs from 'fs/promises';
import handlebars from 'handlebars';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderTemplate = async <T extends Record<string, unknown>>(
  templateName: string,
  context: T,
): Promise<{ html: string; text: string }> => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.mjml`);
  const mjmlRaw = await fs.readFile(templatePath, 'utf-8');

  const compiledMjml = handlebars.compile(mjmlRaw)(context);

  const { html, errors } = mjml2html(compiledMjml);

  const text = convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
    ],
  });

  if (errors && errors.length > 0) {
    console.error('MJML compilation errors:', errors);
    throw new Error('Failed to compile MJML template');
  }

  return { html, text };
};
