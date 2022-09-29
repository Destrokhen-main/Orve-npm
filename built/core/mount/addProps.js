var validSingleProps = require("../linter/index.js").validSingleProps;
var toStyleString = require('to-style').string;
var typeOf = require("../helper/index.js").typeOf;
module.exports.addProps = function (tag, props, node) {
    Object.keys(props).forEach(function (pr) {
        if (pr === "src") {
            // check for function
            //let img = props[pr].default.split("/");
            tag.setAttribute(pr, props[pr].default);
        }
        else if (pr.startsWith("@")) {
            var name_1 = pr.replace("@", "").trim();
            var func = props[pr].bind(node);
            tag.addEventListener(name_1, func);
        }
        else if (pr === "style") {
            // check for function
            var sheet = void 0;
            if (typeOf(props[pr]) === "string") {
                sheet = props[pr];
            }
            else {
                sheet = toStyleString(props[pr]);
            }
            if (sheet.length !== 0)
                tag.setAttribute("style", sheet);
        }
        else if (typeOf(props[pr]) === "proxy") {
            tag.setAttribute(pr, props[pr].value);
            props[pr].parent.push({
                type: "props",
                value: tag,
                key: pr
            });
        }
        else {
            if (typeOf(props[pr]) === "function") {
                var func = props[pr].bind(node);
                var parsedProp = func();
                validSingleProps(parsedProp, pr);
                tag.setAttribute(pr, parsedProp);
            }
            else {
                tag.setAttribute(pr, props[pr]);
            }
        }
    });
};
