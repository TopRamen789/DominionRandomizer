<template>
    <div style="margin: 0 0 auto auto;">
        <div id="costs-chart" style="max-width: 500px; margin: 0 auto;" height="250px" />
        <div id="actions-chart" />
        <div id="buys-chart" />
    </div>
</template>

<script>
import Plotly from 'plotly.js-dist';

export default {
    name: "Chart",
    props: {
        cardSet: Array
    },
    watch: {
        cardSet: function() {
            let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            console.log(isMobile, navigator.userAgent);
            if(!isMobile) {
                let trace = {
                    text: this.cardSet.map(c => c.name),
                    x: this.cardSet.map(c => c.cost),
                    type: 'histogram',
                    marker: {
                        color: 'gold'
                    },
                    spacing: 0.1
                };
                let data = [trace];
                let layout = {
                    title: 'Card Costs',
                    paper_bgcolor: '#000000',
                    plot_bgcolor: '#000000'
                };
                Plotly.newPlot('costs-chart', data, layout, {staticPlot: true});
            }
        }
    }
}
</script>