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
        var randomizer = document.createElement('script');
        randomizer.setAttribute('src', 'src/randomizer.js');
        randomizer.async = true;
        document.head.appendChild(randomizer);
        createScript('src/procedural.js', 'text/javascript');
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
    },
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
                        <span><button type="button" onClick="proceduralGeneration();">Procedural Generation</button></span>
                        <span><button type="button" onClick="randomize();">Random Generation</button></span>
                        <span><button type="button" onClick="testBias();">Test Procedural Generation</button></span>
                        <span><button type="button" onClick="countCards();">Count Cards</button></span>
                    </div>
                    <div style="display: flex; margin-top: 4px; margin-bottom: 4px; justify-content: end;">
                        <button type="button" onClick="saveCardSet();">Save Set</button>
                        <input id="loadFile" class="load-set" style="margin-left: 6px;" type="file" onchange="loadCardSet();" />
                    </div>
                    <div>
                        <div>
                            <span><button type="button" onClick="generateSideboard();">Generate Sideboard</button></span>
                        </div>
                    </div>
                    <form id="controls" class="inputs" style="display: none;">
                        <!-- 
                        <div id="displayEvents"><span>(Adventures/Empires) Number of event cards:<input id="eventInput" type="text"/></span></div>
                        <div id="displayProjects"><span>(Renaissance) Number of project cards:<input id="projectInput" type="text"/></span></div> 
                        -disabling, Dominion recommends at most 2 of any of thes 'sideboard' cards.
                        -->
                        <div>(Max number of cards is 10.)</div>
                        <div><span>Number of 2 cost cards:<input id="2cost" type="text"/></span></div>
                        <div><span>Number of 3 cost cards:<input id="3cost" type="text"/></span></div>
                        <div><span>Number of 4 cost cards:<input id="4cost" type="text"/></span></div>
                        <div><span>Number of 5 cost cards:<input id="5cost" type="text"/></span></div>
                        <div><span>Number of 6 cost cards:<input id="6cost" type="text"/></span></div>
                        <div><span>Total:<input style="margin-left: 20px;" id="total" type="text" disabled="true" value="0"/></span></div>
                        <div><span><button type="button" onClick="randomize();">Randomize</button></span></div>
                        <div><span><input id="forceSets" type="checkbox"/><label htmlFor="forceSets">Enforce at least one card from each checked set </label></div>
                        <div><span><input id="validateTenCards" type="checkbox"/><label htmlFor="validateTenCards">Enforce 10 cards</label></div>
                        <div><span id="error" class="error" /></div>
                    </form>
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