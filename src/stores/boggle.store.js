import { defineStore } from "pinia";

export const useBoggleStore = (id) => defineStore(id, {
        
    state: () => {
        return {
            letters: [],
            selectedLetters: '',
        }
    },
    actions: {
        updateLetters (letters) {
            if (letters.length === this.letters.length) {
                letters.forEach((l,i) => {
                    this.letters[i] = l;
                });
            }
        }
    },
    getters: {
        getLetters() {
            return this.letters;
        }
    }

})();