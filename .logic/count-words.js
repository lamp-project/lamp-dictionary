// @ts-check
import glob from 'glob';
import { join } from 'path';
import JSZip from 'jszip';
import { readFileSync } from 'fs';
import { JSDomHTML } from '@lamp-project/html-utils/dist/JSDomHTML.js';
import { getWords, tokenise, TokensCounter } from '@lamp-project/npl-utils';
import { exportInTSV } from './utils.js';

const SOURCE_EBOOKS_DIR = join(process.cwd(), '../../epub-sources');
const DIST_DIR = join(process.cwd(), '../');

const wordsCount = new TokensCounter();

/**
 *
 * @param {ArrayBuffer} epub
 */
async function processEpub(epub) {
  const zipFile = await JSZip.loadAsync(epub);
  const xhtmlFilenames = Object.keys(zipFile.files).filter((item) =>
    item.endsWith('.xhtml')
  );
  for (const filename of xhtmlFilenames) {
    const xhtmlText = await zipFile.file(filename)?.async('string');
    // @ts-ignore
    const xhtml = new JSDomHTML(xhtmlText);
    for (const node of xhtml.textNodes) {
      // @ts-ignore
      const tokens = tokenise(node.textContent);
      const words = getWords(tokens);
      words.forEach((item) => wordsCount.add(item));
    }
  }
}

async function main() {
  // list ebooks
  const ebooks = glob.sync('**/*.epub', { cwd: SOURCE_EBOOKS_DIR });

  // process items
  for (const path of ebooks) {
    console.time(path);
    await processEpub(readFileSync(join(SOURCE_EBOOKS_DIR, path)));
    console.timeEnd(path);
  }
  const report = wordsCount.sort();
  exportInTSV('words-frequency', report);
}

console.time('executed');
main().finally(() => console.timeEnd('executed'));
