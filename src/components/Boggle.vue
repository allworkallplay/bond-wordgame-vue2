<script setup>
    import { ref, onMounted } from 'vue'
    import Grid from './Grid.vue'
    import { useBoggleStore } from '../stores/boggle.store.js'
    import MathUtils from '../classes/MathUtils.js'
    import WordLookup from '../classes/WordLookup.js'

    const props = defineProps({
        boggleStoreUUID: String,
    });

    // store references
    const boggleStore = useBoggleStore( props.boggleStoreUUID );

    // refs / reactives
    const currentWord = ref('');
    const foundWords = ref([]);

    // references to component instances
    const grid = ref();     // template ref

    // init
    const rows = 4;
    const cols = 4;
    const consonants = 'bcdfghjklmnpqrstvwxyz'; // consonants
    const vowels = 'aeiou';      // vowels
    boggleStore.letters = createLettersList(); // test list ['a','f','g','z','d','i','n','e','t','s','r','g','m','k','b','u'];
    const wordlookup = new WordLookup();

    // ========================================
    // Game Logic
    // ========================================

    function createLettersList () {
       let i, imax, index, list=[];

        // fill entire grid with consonants
        imax = rows*cols;
        for (i=0;i<imax;i++) {
            list.push( consonants[ MathUtils.randRange(0, consonants.length-1) ] );
        }

        // sprinkle some vowels
        imax = MathUtils.randRange(4, 5);    // 4 to 5 vowels
        for (i=0;i<imax;i++) {
            // TO-DO: ensure we don't use a cell we already put a vowel in
            index = MathUtils.randRange(0, list.length-1);   // pick a random cell in the grid
            list[index] = vowels[ MathUtils.randRange(0, vowels.length-1) ];    // assign a radnom vowel to that cell
        }
        
        return list;
    }

    function resetGrid () {
        boggleStore.selectedLetters = '';
        grid.value.selectedCells = [];
        grid.value.resetCellStates();
    }

    // ========================================
    // User Events
    // ========================================

    function onClearClick () {
        resetGrid();
    }

    function onSubmitClick () {
        let found = wordlookup.find ( boggleStore.selectedLetters );

        if (typeof found === 'string') {
            foundWords.value.push( found );
            resetGrid();
        }
    }

    function onNewGameClick () {
        resetGrid();
        foundWords.value.length = 0;
        boggleStore.updateLetters( createLettersList() );
    }
</script>

<template>
    <div class="content-row">

        <div class="game-container">

            <div class="game-selectedletters-container" id="game-selectedletters-container">{{ boggleStore.selectedLetters.toUpperCase() }}</div>

            <div class="cell-grid">
                <Grid
                    ref="grid"
                    :rows="4"
                    :cols="4"
                    :boggleStoreUUID="props.boggleStoreUUID"
                />
            </div>

            <div class="game-status-container">
                <!-- TIME GOES HERE -->
                Words
                <hr>
                <div class="game-status__scorebox" id="game-status__scorebox">
                    <template v-for="word in foundWords">
                        {{ word.toUpperCase() }}<br>
                    </template>
                </div>
            </div>

            <div class="game-interface-container">
                <button @click="onClearClick" class="game-button">Clear</button>
                <button @click="onSubmitClick" class="game-button">Submit</button>
                <button @click="onNewGameClick" class="game-button">New Game</button>
            </div>

        </div>

    </div>
</template>

<style scoped>
  .game-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 50px auto auto;
    column-gap: 10px;
    row-gap: 10px;

    width: 600px;
  }

  .game-selectedletters-container {
    width: 100%;

    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: end;
    text-align: center;
    letter-spacing: 0.2em;
    text-indent: 0.2em;
    overflow-wrap: break-word;
    word-break: break-all;

    padding-bottom: 5px
  }

  .game-status-container {
    grid-column-start: 2;
    grid-row-start: 2;
    grid-row-end: 3;

    padding: 0px 10px;
  }

    .game-status-container hr {
      margin-top: 5px;
      margin-bottom: 10px;
      border: 0px;
      border-top: 1px solid #333333;
    }

  .cell-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-start: 2;
    /* grid-template-rows: repeat(4, 1fr); */
    gap: 5px;
    width: 315px;
  }

  .grid-cell {
    border: 0px solid #444444;
    border-radius: 5px;
    width: 75px;
    height: 75px;
    text-align: center;
    font-size: 28px;
    text-transform: uppercase;

    /* verticall align text */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-color: #333333;
    cursor: pointer;
  }

  .grid-cell.selected {
    background-color: var(--orange-dark);
  }

  .game-interface-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 10px;

    width: 100%;
    grid-row-start: 3;
  }
  
  .game-button {
    width: 48.2%;
  }

  /* first game button */
  .game-button:first-of-type {
    margin-right: 10px;
  }

  .game-button:last-of-type {
    width: 100%;
    background-color: var(--ui-gray-dark);
    color: var(--ui-gray-medium);
  }

  .game-button:last-of-type:hover {
    background-color: var(--ui-gray-medium);
    color: var(--ui-gray-dark);
  }
</style>