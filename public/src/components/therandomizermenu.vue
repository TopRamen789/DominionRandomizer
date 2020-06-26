<template>
    <div style="display: flex; flex-direction: column; width: 250px">
        <button id="randomizeButton" v-on:click="randomize">Randomize</button>
        <button id="saveButton" v-on:click="saveCardSet">Save Set</button>
        <button id="loadButton" v-on:click="loadCardSet">Load Set</button>
        <div id="sets" />
    </div>
</template>

<script>
import randomizer from '../randomizer';
import utilities from '../utilities';

export default {
    name: "RandomizerMenu",
    methods: {
        randomize: function() {
            randomizer.randomize();
        },
        saveCardSet: function() {
            //
        },
        loadCardSet: function() {
            //
        }
    }
}

</script>