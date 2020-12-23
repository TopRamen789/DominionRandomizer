<template>
    <div style="display: flex; flex-direction: column; width: 150px">
        <button id="randomizeButton" v-on:click="randomize">Randomize</button>
        <button id="holidayRandomizeButton" v-on:click="holidayRandomize">Holiday Randomize!</button>
        <!-- <button id="saveButton" v-on:click="saveCardSet">Save Set</button>
        <button id="loadButton" v-on:click="loadCardSet">Load Set</button> -->
        <div id="sets" />
    </div>
</template>

<script>
import randomizer from '../randomizer';

export default {
    name: "RandomizerMenu",
    methods: {
        randomize: function() {
            let randomCards = randomizer.randomize();
            this.$emit('cardSet', randomCards);
        },
        holidayRandomize: function() {
            let randomCards = randomizer.holidayRandomize();
            this.$emit('cardSet', randomCards);
        },
        // saveCardSet: function() {
        //     //
        // },
        // loadCardSet: function() {
        //     //
        // }
    }
}

</script>