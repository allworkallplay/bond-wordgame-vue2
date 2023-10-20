<script setup>
    import { ref, onMounted } from 'vue'
    import Cell from './Cell.vue'
    import { useBoggleStore } from '../stores/boggle.store.js'

    const props = defineProps({
        boggleStoreUUID: String,
        rows: Number,
        cols: Number,
    });

    // store
    const boggleStore = useBoggleStore( props.boggleStoreUUID );

    // init
    const cellMatrix = new Array(props.rows).fill(null);
    cellMatrix.forEach( (row, i, a)=>{ a[i] = new Array(props.cols).fill(null) } );
    const selectedCells = [];
    const totalrows = props.rows;
    const totalcols = props.cols;

    // refs / reactives    
    const cellsList = new Array(props.rows*props.cols).fill(null);

    // mounting
    function mountCellRef ( el, row, col ) {    // called by vue when populating template
        let index = getCellIndex(row,col);
        cellsList[index] = el;
        cellMatrix[row][col] = cellsList[index];
    }

    onMounted( () => {
        cellsList.forEach( (cell) => {
            cell.selectableNeighbors = getCellNeighbors( cell );
        });
    });

    // ==================================
    // Cells
    // ==================================

    function onCellClick ( row, col ) {
        let cell = cellsList[getCellIndex(row, col)];
        let cellSelectable = isCellSelectable( cell );

        if (cellSelectable === true) {
            setCellSelected( cell );
        }
    }

    function resetCellStates () {
        cellsList.forEach( (cell) => {
            cell.state = 'default';
        });

        selectedCells.length = 0;
    }

    function setCellSelected ( cell ) {
        cell.state = 'selected';
        selectedCells.push( cell );

        syncAllCellStates();

        updateSelectedLetters( boggleStore.selectedLetters + cell.props.letter );
    }

    /**
     * getCellIndex is required because rows -> cols were used as the keys in template mounting, and
     * despite defining an index prop in every Cell, it's not ready at the time of mounting.
     * This function is used everywhere that needs a Cell's index but only has row/col from 
     * template mounting to go by.
     * 
     * The alternative approach would be to prefill the cellsList with rows*cols worth of nulls and 
     * loop through THAT for <template> mounting, but I chose to challenge myself with "what if I have to
     * laydown template/components based on related data _and not a direct list of data_ like Vue's traditional
     * v-for approach?". It was a learning experience.
     */
    function getCellIndex ( row, col ) {
        return (row)*props.cols + (col);
    }

    function syncAllCellStates () {
        let cell,nbs;

        // set all to inactive
        cellsList.forEach( (cell) => {
            cell.state = 'default';
        });

        // set selected cells to selected
        selectedCells.forEach( (cell) => {
            cell.state = 'selected';
        });

        // set available cells to available
        nbs = selectedCells[selectedCells.length-1].selectableNeighbors;
        nbs.forEach( (cell) => {
            if ( cell.state !== "selected" ) {
                cell.state = 'available';
            }
        });
    }

    function isCellSelectable ( cell ) {
        let lastcell = selectedCells[selectedCells.length-1] || null;
        let is = false;

        if (lastcell === null ) {
            is = true;    // first cell clicked, of course it's available
        } else {
            lastcell.selectableNeighbors.forEach( (nb) => {
                if (cell === nb) {
                    if (cell.state !== "selected") {
                        is = true;
                    }
                }
            });
        }

        return is;
    }

    function getCellNeighbors ( cell ) {
        let rowcells, row, col, nbs=[];
        row = cell.props.row;
        col = cell.props.col;

        if (row > 0) {
            rowcells = cellMatrix[row-1];
            //console.log("row", cellMatrix[0]);
            if (typeof rowcells[col-1]  !== "undefined") nbs.push( cellMatrix[row-1][col-1] );
            if (typeof rowcells[col]    !== "undefined") nbs.push( cellMatrix[row-1][col] );
            if (typeof rowcells[col+1]  !== "undefined") nbs.push( cellMatrix[row-1][col+1] );
        }

        rowcells = cellMatrix[row];
        if (typeof rowcells[col-1]  !== "undefined") nbs.push( cellMatrix[row][col-1] );
        if (typeof rowcells[col+1]  !== "undefined") nbs.push( cellMatrix[row][col+1] );

        if (row < props.rows-1) {
            rowcells = cellMatrix[row+1];
            if (typeof rowcells[col-1]  !== "undefined") nbs.push( cellMatrix[row+1][col-1] );
            if (typeof rowcells[col]    !== "undefined") nbs.push( cellMatrix[row+1][col] );
            if (typeof rowcells[col+1]  !== "undefined") nbs.push( cellMatrix[row+1][col+1] );
        }

        return nbs;
    }

    // ==================================
    // Letters
    // ==================================

    function updateSelectedLetters ( letters ) {
        boggleStore.selectedLetters = letters;
    }    

    defineExpose({
        resetCellStates,    // so parent can reset the grid as it deems necessary
    });
</script>

<template>
    <div class="cell-grid">
        <template v-for="row in rows">
            <Cell v-for="col in cols"
                :ref="(el) => { mountCellRef(el, row-1, col-1); }"
                :key="'r'+(row-1)+'c'+(col-1)"
                :row="row-1"
                :col="col-1"
                :index="getCellIndex(row-1,col-1)"
                :letter="boggleStore.letters[getCellIndex(row-1,col-1)]"
                @click="onCellClick( row-1, col-1 )"
            />
        </template>
    </div>
</template>

<style scoped>
    .cell-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-start: 2;
        /* grid-template-rows: repeat(4, 1fr); */
        gap: 5px;
        width: 315px;
    }
</style>