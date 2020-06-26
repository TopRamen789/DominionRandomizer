<template>
    <div>
        <button id="randomizeButton" v-onClick="randomize"></button>
        <button id=""></button>
        <button id=""></button>
        <button id=""></button>
    </div>
</template>

<script>
import randomizer from '../randomizer';

export default {
    methods: {
        randomize: function() {
            randomizer.randomize();
        }
    }
}

</script>