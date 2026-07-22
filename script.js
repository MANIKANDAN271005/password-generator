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

function randomChar(chars) {

    const randomArray = new Uint32Array(1);

    window.crypto.getRandomValues(randomArray);

    return chars[randomArray[0] % chars.length];

}

// ======================================
// SHUFFLE PASSWORD
// ======================================

function shufflePassword(pass) {

    return pass
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

}

// ======================================
// TOAST MESSAGE
// ======================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

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

        historyList.innerHTML = "";

        passwordHistory.forEach(createHistoryItem);

    }

    checkStrength();

}

// ======================================
// PASSWORD STRENGTH
// ======================================

function checkStrength() {

    let score = 0;

    if (uppercase.checked) score++;
    if (lowercase.checked) score++;
    if (numbers.checked) score++;
    if (symbols.checked) score++;
    if (Number(length.value) >= 12) score++;

    if (score <= 2) {

        strengthText.textContent = "Weak";
        strengthText.style.color = "#ef4444";

        strengthFill.style.width = "25%";
        strengthFill.style.background = "#ef4444";

    } else if (score === 3) {

        strengthText.textContent = "Medium";
        strengthText.style.color = "#f59e0b";

        strengthFill.style.width = "50%";
        strengthFill.style.background = "#f59e0b";

    } else if (score === 4) {

        strengthText.textContent = "Strong";
        strengthText.style.color = "#22c55e";

        strengthFill.style.width = "75%";
        strengthFill.style.background = "#22c55e";

    } else {

        strengthText.textContent = "Very Strong";
        strengthText.style.color = "#3b82f6";

        strengthFill.style.width = "100%";
        strengthFill.style.background = "#3b82f6";

    }

}

// ======================================
// PASSWORD HISTORY
// ======================================

function createHistoryItem(pass) {

    const li = document.createElement("li");

    li.textContent = "📋 " + pass;

    li.addEventListener("click", () => {

        navigator.clipboard.writeText(pass);

        showToast("Password Copied!");

    });

    historyList.prepend(li);

}

function saveHistory() {

    localStorage.setItem(
        "passwordHistory",
        JSON.stringify(passwordHistory)
    );

}

function loadHistory() {

    const saved = localStorage.getItem("passwordHistory");

    if (!saved) return;

    passwordHistory = JSON.parse(saved);

    historyList.innerHTML = "";

    passwordHistory.forEach(createHistoryItem);

}

// ======================================
// COPY PASSWORD
// ======================================

copyBtn.addEventListener("click", () => {

    if (password.value === "") return;

    navigator.clipboard.writeText(password.value);

    showToast("Password Copied!");

});

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

toggleBtn.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        toggleBtn.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        toggleBtn.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

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

uppercase.addEventListener("change", () => generatePassword(false));
lowercase.addEventListener("change", () => generatePassword(false));
numbers.addEventListener("change", () => generatePassword(false));
symbols.addEventListener("change", () => generatePassword(false));

// ======================================
// CLEAR HISTORY
// ======================================

clearHistoryBtn.addEventListener("click", () => {

    passwordHistory = [];

    historyList.innerHTML = "";

    localStorage.removeItem("passwordHistory");

    showToast("History Cleared");

});

// ======================================
// DARK MODE
// ======================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

// ======================================
// LOAD SAVED THEME
// ======================================

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

// ======================================
// INITIALIZE APP
// ======================================

loadHistory();

generatePassword(false);