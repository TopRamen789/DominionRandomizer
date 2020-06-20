<template>
    <div id="chart" />
</template>

<script>
import adventures from './src/predefined sets/Adventures_sets.js';
import cards from './src/cards_module.js';
import CardUtils from './src/CardUtilities.js';
import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
// import css
import 'frappe-charts/dist/frappe-charts.min.css';


export default {
    name: "Chart",
    data: function() {
        return {
            adventures: adventures
        }
    },
    mounted() {
        let adventuresCards = CardUtils.prototype.filterByNames(cards, adventures[0]).map(c => c.cost);
        console.log(adventuresCards);
        // ok, so the correct approach is to build the aggregates for this graph at least.

        const data = {
            labels: ["Actions", "Cost", "Treasure", "+Treasure"],
            datasets: [
                {
                    name: "Adventures", type: "bar",
                    values: adventuresCards
                },
                {
                    //
                }
            ]
        }

        // const data = {
        //     labels: ["12am-3am", "3am-6pm", "6am-9am", "9am-12am",
        //         "12pm-3pm", "3pm-6pm", "6pm-9pm", "9am-12am"
        //     ],
        //     datasets: [
        //         {
        //             name: "Some Data", type: "bar",
        //             values: [25, 40, 30, 35, 8, 52, 17, -4]
        //         },
        //         {
        //             name: "Another Set", type: "line",
        //             values: [25, 50, -10, 15, 18, 32, 27, 14]
        //         }
        //     ]
        // }

        // eslint-disable-next-line
        const chart = new Chart("#chart", {
            title: "Adventures!",
            data: data,
            type: 'axis-mixed',
            height: 250,
            colors: ['#7cd6fd', '#743ee2']
        });
    }
}
</script>