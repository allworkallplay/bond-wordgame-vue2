import WordTable from '../data/WordTable.js';

export default class WordLookup {
    constructor () {
        this.wordTree = WordTable;
    }

    find ( word ) {   // it feels weird to label this function a "helper" :shrug:
        let found = null;
        let sublist = [];

        if ( typeof word !== 'string' || word.length < 2 ) {    // if we got something weird as an argument
            return found;   // bail and return null

        } else {    // otherwise, drill down the word tree and grab the word list we should check against
            try {   // theoretically this should never throw an error, but complex lookups...well...you never know
                sublist = this.wordTree[word[0]][word[1]];
            } catch (e) {
                console.log("ERROR: ", e);
                return found;
            }
        }

        if (sublist && sublist.length > 0) { // if we found a list of words to check against
            sublist.forEach( (listword) => {
                if (listword === word) {
                    found = word;
                }
            });
        }   // else "found" just stays null and gets returned

        return found;
    }
}