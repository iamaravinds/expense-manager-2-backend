const { groupBy } = require('lodash')
class Analyse {
    constructor(data) {
        this.data = data;
    }
    getCategoryWiseAnalysis() {
        const grouppedResponse = groupBy(this.data, 'category');
        let groupedTotal = {};
        const categories = Object
          .keys(grouppedResponse);
        console.log('categories', categories)
        categories
          .forEach((category) => {
            groupedTotal[category] = grouppedResponse[category]
              .reduce((acc, val)=> {
                acc.credit += Number(val.credit);
                acc.debit += Number(val.debit);
                return acc;
            }, { credit: 0, debit: 0 });
        })
        console.log(groupedTotal);
        return groupedTotal;
    }
}
module.exports = Analyse;
