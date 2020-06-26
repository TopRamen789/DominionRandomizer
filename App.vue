<template>
    <div style="display: flex; flex-direction: row; width: 100%;">
        <RandomizerMenu v-on:cardSet="setCardSet" />
        <div id="app" class="flex">
            <div class="cardListWrapper" style="display: flex; flex-direction: column">
                <h1 id="cardSetHeader" style="align-self: center;"></h1>
                <div id="randomizedCards" class="cardList"></div>
                <div id="sideboard" style="display: grid; grid-template-columns: 204px 204px 204px 204px 204px 204px 204px; margin: 0 -240px"></div>
            </div>
        </div>
        <Chart :card-set="this.cardSet" />
    </div>
</template>

<script>
import Chart from './public/chart';
import RandomizerMenu from './public/src/components/therandomizermenu';

export default {
    name: "App",
    components: {
        Chart,
        RandomizerMenu
    },
    data: function() {
        return {
            cardSet: []
        }
    },
    methods: {
        setCardSet: function(set) {
            this.cardSet = set;
        }
    },
    mounted() {
        let createScript = (src, type = 'module', async = true) => {
            let script = document.createElement('script');
            script.setAttribute('src', src);
            script.setAttribute('type', type);
            script.async = async;
            document.head.appendChild(script);
        };

        var styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', 'styles/styles.css');
        document.head.appendChild(styles);
        createScript('src/checklistAndDefaults.js');
        createScript('src/predefined sets/Adventures_sets.js', 'text/javascript');
        createScript('src/predefined sets/Alchemy_sets.js', 'text/javascript');
        createScript('src/predefined sets/Cornucopia_sets.js', 'text/javascript');
        createScript('src/predefined sets/Dark_Ages_sets.js', 'text/javascript');
        createScript('src/predefined sets/Dominion_(Base_Set)_sets.js', 'text/javascript');
        createScript('src/predefined sets/Empires_sets.js', 'text/javascript');
        createScript('src/predefined sets/Guilds_sets.js', 'text/javascript');
        createScript('src/predefined sets/Hinterlands_sets.js', 'text/javascript');
        createScript('src/predefined sets/Intrigue_sets.js', 'text/javascript');
        createScript('src/predefined sets/Menagerie_(expansion)_sets.js', 'text/javascript');
        createScript('src/predefined sets/Nocturne_sets.js', 'text/javascript');
        createScript('src/predefined sets/Prosperity_sets.js', 'text/javascript');
        createScript('src/predefined sets/Renaissance_sets.js', 'text/javascript');
        createScript('src/predefined sets/Seaside_sets.js', 'text/javascript');
    }
};

</script>