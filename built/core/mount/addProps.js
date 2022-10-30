"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProps = void 0;
var index_js_1 = require("../linter/index.js");
var reactToCSS = require('react-style-object-to-css');
var index_js_2 = require("../helper/index.js");
var addProps = function (tag, props) {
    Object.keys(props).forEach(function (pr) {
        if (pr === "src") {
            // check for function
            //let img = props[pr].default.split("/");
            tag.setAttribute(pr, props[pr].default);
        }
        else if (pr.startsWith("@")) {
            var name_1 = pr.replace("@", "").trim();
            var func = props[pr].bind(window.sReact.sReactContext);
            tag.addEventListener(name_1, func);
        }
        else if (pr === "style") {
            // check for function
            var sheet = void 0;
            if ((0, index_js_2.typeOf)(props[pr]) === "string") {
                sheet = props[pr];
            }
            else {
                sheet = reactToCSS(props[pr]);
            }
            if (sheet.length !== 0)
                tag.setAttribute("style", sheet);
        }
        else if ((0, index_js_2.typeOf)(props[pr]) === "proxy") {
            if (props[pr].value !== "") {
                tag.setAttribute(pr, props[pr].value);
            }
            props[pr].parent.push({
                type: "props",
                value: tag,
                key: pr
            });
        }
        else {
            if ((0, index_js_2.typeOf)(props[pr]) === "function") {
                var parsedProp = props[pr].bind(window.sReact.sReactContext)();
                (0, index_js_1.validSingleProps)(parsedProp, pr);
                tag.setAttribute(pr, parsedProp);
            }
            else {
                tag.setAttribute(pr, props[pr]);
            }
        }
    });
};
exports.addProps = addProps;
