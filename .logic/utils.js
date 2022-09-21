// @ts-check
import { join } from 'path';
import { writeFileSync } from 'fs';

export const DIST_DIR = join(process.cwd(), '../');

/**
 *
 * @param {string} filename
 * @param {(string | number)[][]} data
 */
export function exportInTSV(filename, data) {
  writeFileSync(
    join(DIST_DIR, `${filename}.tsv`),
    data.map((item) => item.join('\t')).join('\n'),
    { encoding: 'utf-8' }
  );
}

/**
 * @param {string} filename
 * @param {any[]} data
 */
export function exportInJS(filename, data) {
  const content = `module.exports = [${data.map(row => JSON.stringify(row)).join(',')}];`;
  writeFileSync(join(DIST_DIR, `${filename}.js`), content, {
    encoding: 'utf-8',
  });
}
