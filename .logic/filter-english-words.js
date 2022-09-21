// @ts-check
import _ from 'lodash';
import { exportTSV, importTSV } from './utils.js';
import { WordNet } from './wordnet.js';
import { TokensCounter } from '@lamp-project/npl-utils';

const wordsCount = new TokensCounter();

async function main() {
  const existingWords = importTSV('english-words-frequency').map(
    ([word]) => word
  );
  const wordsFrequency = importTSV('words-frequency');
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
  exportTSV('english-words-frequency', report);
}

console.time('executed');
main().finally(() => console.timeEnd('executed'));
