var engine;
(function (engine) {
    var DisplayObjectPort = (function () {
        function DisplayObjectPort() {
        }
        var __egretProto__ = DisplayObjectPort.prototype;
        DisplayObjectPort.addTarget = function (value) {
            DisplayObjectPort.hash.set(value.id, value);
        };
        DisplayObjectPort.removeTarget = function (id) {
            return DisplayObjectPort.hash.delete(id);
        };
        DisplayObjectPort.takeTarget = function (id) {
            return DisplayObjectPort.hash.get(id);
        };
        DisplayObjectPort.hasTarget = function (id) {
            return DisplayObjectPort.hash.has(id);
        };
        DisplayObjectPort.hash = new Map();
        return DisplayObjectPort;
    })();
    engine.DisplayObjectPort = DisplayObjectPort;
    DisplayObjectPort.prototype.__class__ = "engine.DisplayObjectPort";
})(engine || (engine = {}));
//# sourceMappingURL=DisplayObjectPort.js.map