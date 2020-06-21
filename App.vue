<template>
    <div>
        <div id="app" v-html="DominionRandomizer"></div>
        <Chart />
    </div>
</template>

<script>
import Chart from './public/chart_test';

export default {
    name: "App",
    components: {
        Chart
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
    },
    // Ok, first order of business is to turn ALL of these into modules
    // and then create another module dedicated to binding onClicks to elements.
    data: function() {
        return {
            DominionRandomizer: `
            Insert set configuration:
            <div class="flex">
                <div style="width: 120px;">
                    <div id="sets"></div>
                    <!--
                    <button type="button" onClick="displaySelectedSets();">Show me cards from these sets</button>
                    -disabled for now-
                    -->
                </div>
                <!--
                <div id="displaySets" class="cardList displaySets"></div>
                -also dislabed, related to above-
                -->
                <div style="margin-left: 20px; width: 350px;">
                    <div style="display: flex; justify-content: end;">
                        <span><input id="hideControlsCheckbox" type="checkbox" onClick="hideControls();" checked />Hide Controls</span>
                        <span><button id="proceduralButton" type="button" onClick="proceduralGeneration();">Procedural Generation</button></span>
                        <span><button id="randomButton" type="button" onClick="randomize();">Random Generation</button></span>
                        <span><button id="testBiasButton" type="button" onClick="testBias();">Test Procedural Generation</button></span>
                        <span><button id="countCardsButton" type="button" onClick="countCards();">Count Cards</button></span>
                    </div>
                    <div style="display: flex; margin-top: 4px; margin-bottom: 4px; justify-content: end;">
                        <button type="button" id="saveSetButton" onClick="saveCardSet();">Save Set</button>
                        <input id="loadFile" class="load-set" style="margin-left: 6px;" type="file" onchange="loadCardSet();" />
                    </div>
                    <div>
                        <div>
                            <span><button id="generatedSideboardButton" type="button" onClick="generateSideboard();">Generate Sideboard</button></span>
                        </div>
                    </div>
                </div>
                <div class="cardListWrapper" style="display: flex; flex-direction: column">
                    <h1 id="cardSetHeader" style="align-self: center;"></h1>
                    <div id="randomizedCards" class="cardList"></div>
                    <div id="sideboard" style="display: grid; grid-template-columns: 320px 320px 320px"></div>
                </div>
                <div class="flex" style="flex-direction: column; margin-left: 80px; height: 600px;">
                    <span class="border">Bias Data</span>
                    <div id="biasData" class="biasList"></div>
                </div>
                <div class="flex" style="flex-direction: column; margin-left: 20px; height: 600px;">
                    <span class="border">Card Distribution Data</span>
                    <div id="cardData" class="dataList"></div>
                </div>
            </div>
            <div>
                <input type="file" id="file-input" />
                <h3>Contents of the file:</h3>
                <pre id="file-content"></pre>
            </div>
            <div>
                <input type="file" id="image-input" />
            </div>
            <div>
                <input type="file" id="predefined-input" />
            </div>
            `
        }
    }
};

</script>