<template>
    <div style="display: flex; flex-direction: row; width: 100%;">
        <RandomizerMenu />
        <div id="app" class="flex">
            <div class="cardListWrapper" style="display: flex; flex-direction: column">
                <h1 id="cardSetHeader" style="align-self: center;"></h1>
                <div id="randomizedCards" class="cardList"></div>
                <div id="sideboard" style="display: grid; grid-template-columns: 204px 204px 204px 204px 204px 204px 204px; margin: 0 -240px"></div>
            </div>
        </div>
        <Chart />
    </div>
</template>

G<script>
import Chart from './public/chart_test';
import RandomizerMenu from './public/src/components/therandomizermenu';

export default {
    name: "App",
    components: {
        Chart,
        RandomizerMenu
    },
    mounted() {
        let createScript = (src, type = 'module', async) => {
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
        var utilities = document.createElement('script');
        utilities.setAttribute('src', 'src/utilities.js');
        utilities.async = true;
        document.head.appendChild(utilities);
        createScript('src/cards.js', 'text/javascript');
        createScript('src/cardutils.js', 'text/javascript');
        
        var validation = document.createElement('script');
        validation.setAttribute('src', 'src/validation.js');
        validation.async = true;
        document.head.appendChild(validation);
        var percentagedata = document.createElement('script');
        percentagedata.setAttribute('src', 'src/percentagedata.js');
        percentagedata.async = true;
        document.head.appendChild(percentagedata);
        var biasdata = document.createElement('script');
        biasdata.setAttribute('src', 'src/biasdata.js');
        biasdata.async = true;
        document.head.appendChild(biasdata);
        createScript('src/randomizer.js');
        createScript('src/procedural.js');
        var checklistAndDefaults = document.createElement('script');
        checklistAndDefaults.setAttribute('src', 'src/checklistAndDefaults.js');
        checklistAndDefaults.async = true;
        document.head.appendChild(checklistAndDefaults);
        var modifyCardData = document.createElement('script');
        modifyCardData.setAttribute('src', 'src/modifycarddata.js');
        modifyCardData.async = true;
        document.head.appendChild(modifyCardData);
        
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
        createScript('src/sets_testing.js', 'text/javascript');
        createScript('src/htmlbinder.js');
    }
};

</script>