"use strict";
var TabData = (function () {
    function TabData(name, index) {
        this.elements = [];
        this.name = name;
        this.index = index;
    }
    // addElement(value: [String, String]) {
    //     this.elements.push(new TabDataElement(value));
    // }
    TabData.prototype.addElement = function (element) {
        this.elements.push(element);
    };
    return TabData;
}());
exports.TabData = TabData;
//# sourceMappingURL=tab-data.js.map