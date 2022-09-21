// @ts-check
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export const DIST_DIR = join(process.cwd(), '../');

/**
 *
 * @param {string} filename
 * @param {(string | number)[][]} data
 */
export function exportTSV(filename, data) {
  writeFileSync(
    join(DIST_DIR, `${filename}.tsv`),
    data
      .map((item) =>
        item.map((cell) => cell.toString().replace(/\t/g, ' ')).join('\t')
      )
      .join('\n'),
    { encoding: 'utf-8' }
  );
}
export function importTSV(filename) {
  return readFileSync(join(DIST_DIR, `${filename}.tsv`), {
    encoding: 'utf-8',
  })
    .split('\n')
    .map((line) => line.split('\t').map((item) => item.trim()));
}
/**
 * @param {string} filename
 * @param {any[]} data
 */
export function exportJS(filename, data) {
  const content = `module.exports = [${data
    .map((row) => JSON.stringify(row))
    .join(',')}];`;
  writeFileSync(join(DIST_DIR, `${filename}.js`), content, {
    encoding: 'utf-8',
  });
}
