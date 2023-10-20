<script setup>
    import { ref } from 'vue'

    const props = defineProps({
        row: Number,
        col: Number,
        state: String,
        letter: String,
        index: Number,
    });
    
    const state = ref(props.state || "default");   // default, selected, available
    const letter = ref(props.letter);
    const selectableNeighbors = [];
    const index = props.index.value;

    defineExpose({
        state,
        props,
        index,
        selectableNeighbors,
    });
</script>

<template>
  <div
    class="cell"
    :class="{
        'selected': state === 'selected'
        ,'available': state === 'available'}"
  >
    {{ props.letter }}
  </div>
</template>

<style scoped>
    .cell {
        border: 0px solid #444444;
        border-radius: 5px;
        width: 75px;
        height: 75px;
        text-align: center;
        font-size: 28px;
        text-transform: uppercase;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        background-color: #333333;
        cursor: pointer;
    }

    .cell.selected {
        background-color: var(--orange-dark);
    }

    .cell.available {
        background-color: #50492d;
    }
</style>