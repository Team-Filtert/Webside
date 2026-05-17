var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const text = "A Neuro-sama fan game presented by team Filtered";
let i = 0;
function type() {
    const element = document.getElementById("typing");
    if (!element)
        return;
    if (i < text.length) {
        element.innerHTML += text[i];
        i++;
        setTimeout(type, 40);
    }
}
type();
const stars = document.getElementById("stars");
for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    const middle = document.createElement("div");
    const inner = document.createElement("div");
    star.classList.add("star");
    middle.classList.add("star-middle");
    inner.classList.add("star-inner");
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = 10 + Math.random() * 20 + "s";
    middle.style.animationDelay = Math.random() * 5 + "s";
    middle.style.animationDuration = 15 + Math.random() * 30 + "s";
    inner.style.left = Math.random() * 100 + "vw";
    inner.style.top = Math.random() * 100 + "vh";
    const size = Math.random() * 3 + 1;
    inner.style.width = size + "px";
    inner.style.height = size + "px";
    inner.style.animationDelay = Math.random() * 5 + "s";
    inner.style.animationDuration = 5 + Math.random() * 10 + "s";
    middle.appendChild(inner);
    star.appendChild(middle);
    stars.appendChild(star);
}
function loadComponent(id, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(path);
        const html = yield response.text();
        document.getElementById(id).innerHTML = html;
    });
}
loadComponent("navbar", "./components/navbar.html");
loadComponent("footer", "./components/footer.html");
import { initTeamCards } from "./team.js";
document.addEventListener("DOMContentLoaded", () => {
    initTeamCards(); // targets all .card elements by default
});
