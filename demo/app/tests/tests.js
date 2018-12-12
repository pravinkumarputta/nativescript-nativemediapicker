var Nativemediapicker = require("nativescript-nativemediapicker").Nativemediapicker;
var nativemediapicker = new Nativemediapicker();

describe("greet function", function() {
    it("exists", function() {
        expect(nativemediapicker.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(nativemediapicker.greet()).toEqual("Hello, NS");
    });
});