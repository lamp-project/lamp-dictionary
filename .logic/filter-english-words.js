// @ts-check
import { readFileSync } from 'fs';
import { join } from 'path';
import _ from 'lodash';
import { DIST_DIR, exportInTSV } from './utils.js';
import { WordNet } from './wordnet.js';
import { TokensCounter } from '@lamp-project/npl-utils';

const wordsCount = new TokensCounter();

async function main() {
  const existingWords = readFileSync(
    join(DIST_DIR, 'english-words-frequency.tsv'),
    { encoding: 'utf-8' }
  )
    .split('\n')
    .map((line) => line.split('\t'))
    .map(([word]) => word.trim());
  const wordsFrequency = readFileSync(join(DIST_DIR, 'words-frequency.tsv'), {
    encoding: 'utf-8',
  })
    .split('\n')
    .map((line) => line.split('\t'));
  let counter = 0;
  const chuncks = _.chunk(wordsFrequency, 1000);

  for (const chunck of chuncks) {
    await Promise.all(
      chunck.map(async ([word, count]) => {
        counter++;
        if (!word) return;
        if (existingWords.includes(word)) {
          wordsCount.add(word, +count);
        } else {
          const definitions = await WordNet.definitions(word);
          if (definitions.length > 0) {
            wordsCount.add(word, +count);
          }
        }
      })
    );
    console.log(`${((counter * 100) / wordsFrequency.length).toFixed(2)}%`);
  }

  const report = wordsCount.sort();
  exportInTSV('english-words-frequency', report);
}

console.time('executed');
main().finally(() => console.timeEnd('executed'));
