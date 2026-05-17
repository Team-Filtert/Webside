var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var text = "A Neuro-sama fan game presented by team Filtered";
var i = 0;
function type() {
    var element = document.getElementById("typing");
    if (!element)
        return;
    if (i < text.length) {
        element.innerHTML += text[i];
        i++;
        setTimeout(type, 50);
    }
}
type();
var stars = document.getElementById("stars");
for (var i_1 = 0; i_1 < 200; i_1++) {
    var star = document.createElement("div");
    var middle = document.createElement("div");
    var inner = document.createElement("div");
    star.classList.add("star");
    middle.classList.add("star-middle");
    inner.classList.add("star-inner");
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = 10 + Math.random() * 20 + "s";
    middle.style.animationDelay = Math.random() * 5 + "s";
    middle.style.animationDuration = 15 + Math.random() * 30 + "s";
    inner.style.left = Math.random() * 100 + "vw";
    inner.style.top = Math.random() * 100 + "vh";
    var size = Math.random() * 3 + 1;
    inner.style.width = size + "px";
    inner.style.height = size + "px";
    inner.style.animationDelay = Math.random() * 5 + "s";
    inner.style.animationDuration = 5 + Math.random() * 10 + "s";
    middle.appendChild(inner);
    star.appendChild(middle);
    stars.appendChild(star);
}
function loadComponent(id, path) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(path)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    html = _a.sent();
                    document.getElementById(id).innerHTML = html;
                    return [2 /*return*/];
            }
        });
    });
}
loadComponent("navbar", "./components/navbar.html");
loadComponent("footer", "./components/footer.html");
