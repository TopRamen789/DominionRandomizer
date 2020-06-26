<template>
    <div width="250" height="250">
        <div id="costs-chart" style="max-width: 500px; margin: 0 auto;" height="250px" />
        <div id="actions-chart" />
        <div id="buys-chart" />
    </div>
</template>

<script>
import adventures from './src/predefined sets/Adventures_sets.js';
import _Cards from './src/cards_module.js';
import CardUtils from './src/CardUtilities.js';
import Plotly from 'plotly.js-dist'

export default {
    name: "Chart",
    data: function() {
        return {
            adventures: adventures
        }
    },
    mounted() {
        let cards = CardUtils.prototype.filterByNames(_Cards, adventures[0]);
        let cardCosts = cards.map(c => c.cost);
        let cardActions = cards.map(c => c.actions == null ? 0 : c.actions);
        let cardBuys = cards.map(c => c.buys == null ? 0 : c.buys);
        let cardDraws = cards.map(c => c.cards == null ? 0 : c.cards);
        
        let trace = {
            x: cardCosts,
            type: 'histogram',
            marker: {
                color: 'gold'
            }
        };
        var data = [trace];
        var layout = {
            title: 'Card Costs',
            paper_bgcolor: '#000000',
            plot_bgcolor: '#000000'
        };
        Plotly.newPlot('costs-chart', data, layout);
    }
}
</script>