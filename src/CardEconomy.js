import CardUtilities from './CardUtilities';
import Utilities from './utilities';
import _cards from './data/cards_module';

class CardEconomy {
    constructor() { }

    static buildPredefinedSets() {
        let sets = [];
        // sets = sets.concat(alchemySets);
        // sets = sets.concat(cornucopiaSets);
        // sets = sets.concat(darkAgesSets);
        // sets = sets.concat(dominionBaseSets);
        // sets = sets.concat(empiresSets);
        // sets = sets.concat(guildsSets);
        // sets = sets.concat(hinterlandsSets);
        // sets = sets.concat(intrigueSets);
        // sets = sets.concat(menagerieSets);
        // sets = sets.concat(nocturneSets);
        // sets = sets.concat(prosperitySets);
        // sets = sets.concat(renaissanceSets);
        // sets = sets.concat(seasideSets);
        return sets;
    }
    
    // Needs more work, some cards return with no cost value probably because it's debt or something...
    static rebuildPredefinedSetCostCurves() {
        let allAggregates = [];
        let sets = this.buildPredefinedSets();
        sets.forEach((set) => {
            let costAggregates = [];
            set.forEach(card => card.replace(/^\w/, c => c.toUpperCase()));
            set = set.slice(1,11);
            let namedCards = CardUtilities.filterByNames(_cards, set);
            let distinctCosts =  CardUtilities.getDistinctCardCosts(namedCards);
            distinctCosts.filter(c => c != "").forEach((cost) => {
                let number = namedCards.filter(f => f.cost == cost).length;
                costAggregates.push({
                    cost: cost,
                    number: number
                });
            });
            allAggregates.push(costAggregates);
            costAggregates.reduce((acc, val) => acc += val.number)
            if(costAggregates != 10) {
                console.log(namedCards);
            }
        });
        let json = JSON.stringify(allAggregates, null, 4);
        Utilities.download(json, "predefined_cost_curves", ".js");
    }
}

export default CardEconomy;