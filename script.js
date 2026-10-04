// ====== SETTINGS: apna number yahan badlein (country code ke saath, bina + ke) ======
const DEFAULT_NAME = "Manoj Srivastava";
const DEFAULT_MOBILE = "919415612619"; // <-- yahan apna WhatsApp/Call number daalein
// ===================================================================================

const $ = id => document.getElementById(id);
const val = el => Math.max(0, parseFloat(typeof el === "string" ? $(el).value : el.value) || 0);

// Advisor info from referral link: ?ref=Name&m=91XXXXXXXXXX
const qs = new URLSearchParams(location.search);
const advisor = { name: (qs.get("ref") || DEFAULT_NAME).trim(), mobile: (qs.get("m") || DEFAULT_MOBILE).replace(/\D/g, "") };
$("advisorHeroName").textContent = advisor.name;
$("advisorName").textContent = advisor.name;
$("callBtn").href = "tel:+" + advisor.mobile;

function rs(n) {
  n = Math.round(n);
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " करोड़";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2).replace(/\.?0+$/, "") + " लाख";
  return "₹" + n.toLocaleString("en-IN");
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

let last = {};

function calculate() {
  const age = val("age") || 35, kids = val("children");
  const married = $("married").value === "Married";
  const income = val("income") + val("income2");
  let spend = 0;
  document.querySelectorAll(".exp").forEach(e => spend += val(e));
  const emi = val("emi");
  const surplus = income - spend;
  const savePct = income ? surplus / income : 0;
  const emiPct = income ? emi / income : 0;

  // Insurance need
  const mult = age <= 35 ? 15 : age <= 45 ? 12 : 10;
  const needCover = income ? income * 12 * clamp(mult + kids, 10, 25) : 0;
  const gapCover = Math.max(0, needCover - val("curCover"));
  let needHealth = married ? 1000000 : 500000;
  if (kids >= 2) needHealth += 500000;
  const gapHealth = Math.max(0, needHealth - val("curHealth"));
  const budget = income ? Math.max(0, Math.min(surplus * 0.5, income * 0.15)) : 0;
  const emerg = spend * 6;
  const sav = val("savings");

  // Score (out of 100)
  const sSave = income ? clamp(savePct / 0.2, 0, 1) * 40 : 0;
  const sEmi = income ? clamp(20 - (emiPct - 0.2) * 50, 0, 20) : 0;
  const sCover = needCover ? clamp(val("curCover") / needCover, 0, 1) * 25 : 0;
  const sEmerg = emerg ? clamp(sav / emerg, 0, 1) * 15 : 0;
  const score = income ? Math.round(sSave + sEmi + sCover + sEmerg) : 0;

  // Result panel
  const el = $("surplus");
  el.textContent = (surplus < 0 ? "-" : "") + rs(Math.abs(surplus));
  el.className = "big " + (!income ? "" : surplus >= 0 ? "pos" : "neg");
  $("surplusSub").textContent = !income ? "आमदनी डालते ही यहाँ तुरंत नतीजा दिखेगा"
    : surplus < 0 ? "खर्च आमदनी से ज़्यादा है - पहले खर्च कम करें"
    : "आपकी आमदनी का " + Math.round(savePct * 100) + "% हर महीने बचता है";

  const pExp = income ? clamp((spend - emi) / income, 0, 1) : 0;
  const pEmi = income ? clamp(emiPct, 0, 1 - pExp) : 0;
  const pSave = income ? clamp(savePct, 0, 1) : 0;
  $("barExp").style.width = pExp * 100 + "%";
  $("barEmi").style.width = pEmi * 100 + "%";
  $("barSave").style.width = pSave * 100 + "%";
  $("pExp").textContent = Math.round(pExp * 100) + "%";
  $("pEmi").textContent = Math.round(pEmi * 100) + "%";
  $("pSave").textContent = Math.round(pSave * 100) + "%";

  $("score").textContent = score;
  const ring = $("ring");
  ring.style.strokeDashoffset = 327 * (1 - score / 100);
  const grade = !income ? "-" : score >= 75 ? "बहुत अच्छी" : score >= 50 ? "ठीक-ठाक, सुधार संभव" : "ध्यान देने की ज़रूरत";
  ring.style.stroke = score >= 75 ? "#12805c" : score >= 50 ? "#c27a00" : "#c23b3b";
  $("grade").textContent = grade;

  $("needCover").textContent = income ? rs(needCover) : "-";
  $("gapCover").textContent = income ? (gapCover ? rs(gapCover) : "पूरा ✔") : "-";
  $("needHealth").textContent = income ? rs(needHealth) + (gapHealth ? "" : " ✔") : "-";
  $("budget").textContent = income ? rs(budget) + "/माह" : "-";
  $("emerg").textContent = income ? rs(emerg) + (sav >= emerg ? " ✔" : " (जमा: " + rs(sav) + ")") : "-";
  $("emiPct").textContent = income ? Math.round(emiPct * 100) + "%" + (emiPct > 0.4 ? " ⚠" : "") : "-";

  // Tips
  const tips = [];
  if (income) {
    if (surplus < 0) tips.push("खर्च आमदनी से " + rs(-surplus) + " ज़्यादा है। सबसे बड़े खर्च की सूची बनाकर कटौती करें।");
    else if (savePct < 0.2) tips.push("बचत 20% से कम है। लक्ष्य रखें: हर महीने कम से कम " + rs(income * 0.2) + " बचाना।");
    if (emiPct > 0.4) tips.push("EMI आमदनी के 40% से ऊपर है - नया लोन न लें और पुराना जल्दी निपटाने की योजना बनाएँ।");
    if (gapCover > 0) tips.push("परिवार की सुरक्षा के लिए लगभग " + rs(gapCover) + " का Term Plan और लेना चाहिए।");
    if (gapHealth > 0) tips.push("हेल्थ कवर कम है - " + rs(needHealth) + " तक का Family Floater देखें।");
    if (budget > 0 && (gapCover > 0 || gapHealth > 0)) tips.push("बीमा पर हर महीने " + rs(budget) + " तक खर्च करना आपके बजट के लिए सुरक्षित है।");
    if (budget === 0 && (gapCover > 0 || gapHealth > 0)) tips.push("अभी बीमा के लिए बजट नहीं बचता - पहले खर्च घटाएँ, फिर छोटा Term Plan शुरू करें।");
    if (sav < emerg) tips.push("इमरजेंसी फंड में " + rs(emerg - sav) + " और जोड़ें (6 महीने के खर्च के बराबर)।");
  }
  $("tips").innerHTML = tips.slice(0, 5).map(t => "<li>" + t.replace(/</g, "&lt;") + "</li>").join("");

  last = { income, spend, surplus, score, needCover, gapCover, needHealth, budget, emerg };
  updateWhatsApp();
}

function updateWhatsApp() {
  const n = $("name").value.trim(), m = $("mobile").value.trim();
  const L = last;
  const msg = "नमस्ते " + advisor.name + " जी,\n" +
    "मैंने MyFinancialScore पर अपनी जाँच की।\n" +
    (n ? "नाम: " + n + "\n" : "") + (m ? "मोबाइल: " + m + "\n" : "") +
    "लक्ष्य: " + $("goal").value + "\n" +
    "आमदनी: " + rs(L.income || 0) + "/माह | खर्च: " + rs(L.spend || 0) + "/माह\n" +
    "बचत: " + (L.surplus < 0 ? "-" : "") + rs(Math.abs(L.surplus || 0)) + "/माह\n" +
    "Financial Score: " + (L.score || 0) + "/100\n" +
    "सुझाया Term कवर: " + rs(L.needCover || 0) + " | बीमा बजट: " + rs(L.budget || 0) + "/माह\n" +
    "कृपया मुझे पूरी रिपोर्ट भेजें।";
  $("whatsappBtn").href = "https://wa.me/" + advisor.mobile + "?text=" + encodeURIComponent(msg);
}

document.querySelectorAll(".calc, #name, #mobile, #goal").forEach(e => e.addEventListener("input", calculate));
document.querySelectorAll("select").forEach(e => e.addEventListener("change", calculate));

// ===== Live visitors + likes (Google Apps Script) =====
const COUNTER_URL = "https://script.google.com/macros/s/AKfycby6SF6hOIt6QL0AxQtjf3XXE4ZDTYd5McTYPVaINZcNYxVEKLLrhYaz5DEUF3aNkmVy2Q/exec";
const VISITOR_OFFSET = 0; // purane visitor count se shuru karna ho to wo number yahan likhein
const LIKE_OFFSET = 0;    // purane likes se shuru karna ho to wo number yahan likhein
const num = n => Number(n).toLocaleString("en-IN");

async function hit(action) {
  try {
    const r = await fetch(COUNTER_URL + "?a=" + action + "&t=" + Date.now());
    if (!r.ok) throw 0;
    return await r.json();
  } catch (e) { return null; }
}

(async () => {
  const first = !sessionStorage.getItem("seen");
  const d = await hit(first ? "visit" : "get");
  if (first && d) sessionStorage.setItem("seen", "1");
  $("visitCount").textContent = d ? num(d.visits + VISITOR_OFFSET) : "-";
  $("likeCount").textContent = d ? num(d.likes + LIKE_OFFSET) : "-";
  if (localStorage.getItem("liked")) setLiked(true);
})();

function setLiked(on) {
  $("likeBtn").classList.toggle("liked", on);
  $("likeBtn").setAttribute("aria-pressed", on);
  $("likeIcon").textContent = on ? "♥" : "♡";
}
$("likeBtn").addEventListener("click", async () => {
  if (localStorage.getItem("liked")) return;
  const d = await hit("like");
  if (!d) return;
  localStorage.setItem("liked", "1");
  setLiked(true);
  $("likeCount").textContent = num(d.likes + LIKE_OFFSET);
});

// ===== Suggestion box (WhatsApp) =====
$("sugBtn").addEventListener("click", () => {
  const box = $("sugBox"), open = box.hidden;
  box.hidden = !open;
  $("sugBtn").setAttribute("aria-expanded", open);
  if (open) $("sugText").focus();
});
$("sugSend").addEventListener("click", () => {
  const t = $("sugText").value.trim();
  if (!t) { $("sugText").focus(); return; }
  const n = $("name").value.trim();
  const msg = "MyFinancialScore पर सुझाव" + (n ? " (" + n + ")" : "") + ":\n" + t;
  window.open("https://wa.me/" + advisor.mobile + "?text=" + encodeURIComponent(msg), "_blank");
});

calculate();
