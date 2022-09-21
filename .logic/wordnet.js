// @ts-check
import axios from 'axios';

export class WordNet {
  /**
   *
   * @param {string} path
   * @returns {Promise<any[]>}
   */
  static async query(path) {
    return await axios
      .get(`http://localhost:5679/${path}`)
      .then(({ data }) => data);
  }
  /**
   *
   * @param {string} word
   * @returns {Promise<any[]>}
   */
  static async definitions(word) {
    if (!word) return [];
    return await this.query(`definition/${word}`);
  }
  /**
   *
   * @param {string} word
   * @returns {Promise<any[]>}
   */
  static async synonyms(word) {
    if (!word) return [];
    return await this.query(`synonym/1/${word}`);
  }
}
