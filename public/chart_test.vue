<template>
    <div>
        <div id="costs-chart" />
        <div id="actions-chart" />
        <div id="buys-chart" />
    </div>
</template>

<script>
import adventures from './src/predefined sets/Adventures_sets.js';
import _Cards from './src/cards_module.js';
import CardUtils from './src/CardUtilities.js';
import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
// import css
import 'frappe-charts/dist/frappe-charts.min.css';
let aggregate = (set) => {
    let newSet = {};
    set.filter((value,index,self) => {
        return self.indexOf(value) == index;
    }).forEach((s) => {
        let setCount = set.filter(t => t == s).length;
        newSet[s] = setCount;
    });
    return newSet;
};

let buildLabels = (array,label) => {
    return Object.keys(array).map(k => `${k} ${label}`);
};

let buildDataSet = (array,label) => {
    let aggregateSet = aggregate(array);
    let data = {
        labels: buildLabels(aggregateSet,label),
        datasets: [
            {
                values: Object.keys(aggregateSet).map(k => aggregateSet[k])
            }
        ]
    };
    return data;
};

let buildPieChart = (id, title, data, colors) => {
    return new Chart(`#${id}`, {
        title: title,
        data: data,
        type: 'pie',
        height: 250,
        colors: colors
    });
};

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

        const costData = buildDataSet(cardCosts, "Treasure");
        const actionData = buildDataSet(cardActions, "Actions");
        const buyData = buildDataSet(cardBuys, "Buys");
        //     values: cardBuys
        //     values: cardDraws

        // eslint-disable-next-line
        const costChart = buildPieChart('costs-chart', 'Costs', costData, ['#82630e', '#967311', '#b08612', '#c79610', '#edb313']);
        const actionsChart = buildPieChart('actions-chart', '+Actions', actionData, ['#003f7a','#0058ab','#0887ff']);
        const buysChart = buildPieChart('buys-chart', '+Buys', buyData, []);
    }
}
</script>