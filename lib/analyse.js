const { groupBy } = require('lodash')
class Analyse {
    constructor(data) {
        this.data = data;
    }
    getCategoryWiseAnalysis() {
        return groupBy(this.data, 'category');
    }
}
module.exports = Analyse;
