// ======================================
// DOM ELEMENTS
// ======================================

const password = document.getElementById("password");
const length = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const toggleBtn = document.getElementById("toggleBtn");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const toast = document.getElementById("toast");

const themeBtn = document.getElementById("themeBtn");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// ======================================
// CHARACTER SETS
// ======================================

const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "!@#$%^&*()_+-={}[]<>?/";

// ======================================
// PASSWORD HISTORY
// ======================================

let passwordHistory = [];

// ======================================
// SLIDER
// ======================================

length.addEventListener("input", () => {

    lengthValue.textContent = length.value;

    generatePassword(false);

});

// ======================================
// RANDOM CHARACTER
// ======================================

function randomIndex(max) {

    const randomArray = new Uint32Array(1);

    window.crypto.getRandomValues(randomArray);

    return randomArray[0] % max;

}

function randomChar(chars) {

    return chars[randomIndex(chars.length)];

}

// ======================================
// SHUFFLE PASSWORD (Fisher-Yates)
// ======================================

function shufflePassword(pass) {

    const chars = pass.split("");

    for (let i = chars.length - 1; i > 0; i--) {

        const j = randomIndex(i + 1);

        [chars[i], chars[j]] = [chars[j], chars[i]];

    }

    return chars.join("");

}

// ======================================
// TOAST MESSAGE
// ======================================

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}

// ======================================
// STORAGE (safe when localStorage is blocked)
// ======================================

function getStored(key) {

    try {

        return localStorage.getItem(key);

    } catch {

        return null;

    }

}

function setStored(key, value) {

    try {

        localStorage.setItem(key, value);

    } catch {

        // Storage unavailable (private mode / blocked cookies)

    }

}

// ======================================
// COPY TO CLIPBOARD
// ======================================

function copyText(text) {

    if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(text)
            .then(() => showToast("Password Copied!"))
            .catch(() => fallbackCopy(text));

    } else {

        fallbackCopy(text);

    }

}

function fallbackCopy(text) {

    const previousFocus = document.activeElement;

    const temp = document.createElement("textarea");

    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";

    document.body.appendChild(temp);

    temp.select();

    let copied = false;

    try {

        copied = document.execCommand("copy");

    } catch {

        copied = false;

    }

    document.body.removeChild(temp);

    if (previousFocus) previousFocus.focus();

    showToast(copied ? "Password Copied!" : "Copy failed. Please copy manually.");

}

// ======================================
// GENERATE PASSWORD
// ======================================

function generatePassword(saveToHistory = true) {

    let chars = "";
    let pass = "";

    if (uppercase.checked) {

        chars += upper;
        pass += randomChar(upper);

    }

    if (lowercase.checked) {

        chars += lower;
        pass += randomChar(lower);

    }

    if (numbers.checked) {

        chars += number;
        pass += randomChar(number);

    }

    if (symbols.checked) {

        chars += symbol;
        pass += randomChar(symbol);

    }

    if (chars === "") {

        alert("Please select at least one character type.");

        return;

    }

    while (pass.length < Number(length.value)) {

        pass += randomChar(chars);

    }

    pass = shufflePassword(pass);

    password.value = pass;

    if (saveToHistory) {

        passwordHistory.unshift(pass);

        if (passwordHistory.length > 5) {

            passwordHistory.pop();

        }

        saveHistory();

        renderHistory();

    }

    checkStrength();

}

// ======================================
// PASSWORD STRENGTH
// ======================================

function checkStrength() {

    // Entropy in bits = length × log2(character pool size)

    let poolSize = 0;

    if (uppercase.checked) poolSize += upper.length;
    if (lowercase.checked) poolSize += lower.length;
    if (numbers.checked) poolSize += number.length;
    if (symbols.checked) poolSize += symbol.length;

    const entropy = Number(length.value) * Math.log2(poolSize);

    if (entropy < 40) {

        strengthText.textContent = "Weak";
        strengthText.style.color = "#e0626d";

        strengthFill.style.width = "25%";
        strengthFill.style.background = "#e0626d";

    } else if (entropy < 60) {

        strengthText.textContent = "Medium";
        strengthText.style.color = "#e8a85c";

        strengthFill.style.width = "50%";
        strengthFill.style.background = "#e8a85c";

    } else if (entropy < 80) {

        strengthText.textContent = "Strong";
        strengthText.style.color = "#5fbf9a";

        strengthFill.style.width = "75%";
        strengthFill.style.background = "#5fbf9a";

    } else {

        strengthText.textContent = "Very Strong";
        strengthText.style.color = "#f5d27a";

        strengthFill.style.width = "100%";
        strengthFill.style.background = "#f5d27a";

    }

}

// ======================================
// PASSWORD HISTORY
// ======================================

function createHistoryItem(pass) {

    const li = document.createElement("li");

    li.textContent = "📋 " + pass;

    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.title = "Copy Password";

    li.addEventListener("click", () => copyText(pass));

    li.addEventListener("keydown", (e) => {

        if (e.key === "Enter" || e.key === " ") {

            e.preventDefault();

            copyText(pass);

        }

    });

    historyList.append(li);

}

function renderHistory() {

    historyList.innerHTML = "";

    passwordHistory.forEach(createHistoryItem);

}

function saveHistory() {

    setStored(
        "passwordHistory",
        JSON.stringify(passwordHistory)
    );

}

function loadHistory() {

    let saved;

    try {

        saved = JSON.parse(getStored("passwordHistory"));

    } catch {

        saved = null;

    }

    if (!Array.isArray(saved)) return;

    passwordHistory = saved.slice(0, 5);

    renderHistory();

}

// ======================================
// COPY PASSWORD
// ======================================

copyBtn.addEventListener("click", () => {

    if (password.value === "") return;

    copyText(password.value);

});

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

toggleBtn.addEventListener("click", () => {

    const show = password.type === "password";

    password.type = show ? "text" : "password";

    toggleBtn.innerHTML = show
        ? '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-eye" aria-hidden="true"></i>';

    toggleBtn.title = show ? "Hide Password" : "Show Password";

    toggleBtn.setAttribute("aria-pressed", String(show));

});

// ======================================
// GENERATE BUTTON
// ======================================

generateBtn.addEventListener("click", () => {

    generatePassword(true);

});

// ======================================
// AUTO GENERATE WHEN OPTIONS CHANGE
// ======================================

[uppercase, lowercase, numbers, symbols].forEach((option) => {

    option.addEventListener("change", () => {

        // Keep at least one character type selected

        if (!uppercase.checked && !lowercase.checked &&
            !numbers.checked && !symbols.checked) {

            option.checked = true;

            showToast("Select at least one character type");

            return;

        }

        generatePassword(false);

    });

});

// ======================================
// CLEAR HISTORY
// ======================================

clearHistoryBtn.addEventListener("click", () => {

    passwordHistory = [];

    renderHistory();

    saveHistory();

    showToast("History Cleared");

});

// ======================================
// DARK MODE
// ======================================

function applyTheme(isDark) {

    document.body.classList.toggle("dark", isDark);

    themeBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

    themeBtn.setAttribute("aria-pressed", String(isDark));

}

themeBtn.addEventListener("click", () => {

    const isDark = !document.body.classList.contains("dark");

    applyTheme(isDark);

    setStored("theme", isDark ? "dark" : "light");

});

// ======================================
// LOAD SAVED THEME
// ======================================

if (getStored("theme") === "dark") {

    applyTheme(true);

}

// ======================================
// INITIALIZE APP
// ======================================

loadHistory();

generatePassword(false);