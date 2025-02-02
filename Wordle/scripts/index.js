var gameStarted = false;
var currentBox = -1;
var row = 0;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000));
};

const unfocus = () => {
  document.activeElement.blur();
};

const backspace = (key = "Backspace") => {
  if (key != "Backspace") return;
  if (currentBox <= row * 5 - 1) return;

  document.getElementById("box" + currentBox).classList.add("none");
  document.getElementById("box" + currentBox).classList.remove("noneWithText");
  document.getElementById("box" + currentBox).classList.remove("zoomOut");
  document.getElementById("box" + currentBox).querySelector("p").textContent =
    "";
  currentBox--;
};

const enterProcedure = async (error) => {
  var fault = document.getElementById("fault");

  fault.textContent = error;
  fault.classList.remove("hide");
  fault.classList.remove("fadeOut");
  document.getElementById("row" + row).classList.add("shake");
  await sleep(1000);
  fault.classList.add("fadeOut");
  await sleep(190);
  fault.classList.add("hide");
  document.getElementById("row" + row).classList.remove("shake");
};

const enter = async (key = "Enter") => {
  if (key != "Enter") return;
  if (currentBox <= -1) return;
  if (!gameStarted) return;

  var word = "";

  for (let i = row * 5; i < row * 5 + 5; i++) {
    word += document.getElementById("box" + i).querySelector("p").textContent;
  }

  if ([1, 2, 3, 4].includes(word.length)) {
    await enterProcedure("單字長度不夠!");
    return;
  }
  if (!window.words.includes(word.toLowerCase())) {
    await enterProcedure("不在單字列表中!");
    return;
  }
  if (currentBox == row * 5 + 4) {
    await checkWord(word);
    return;
  }
};

const letter = (key) => {
  if (!gameStarted && /^[a-zA-Z]$/.test(key)) {
    gameStarted = true;
    window.start = Date.now();
  }
  if (/^[a-zA-Z]$/.test(key) && currentBox < row * 5 + 4) {
    currentBox++;
    document.getElementById("box" + currentBox).querySelector("p").textContent =
      key.toUpperCase();
    document.getElementById("box" + currentBox).classList.remove("none");
    document.getElementById("box" + currentBox).classList.add("noneWithText");
    document.getElementById("box" + currentBox).classList.add("zoomOut");
  }
};

document.onkeydown = function (e) {
  backspace(e.key);
  enter(e.key);
  letter(e.key);
};

// game logic here

const pick_word = () => {
  fetch("lib/words.txt")
    .then((response) => response.text())
    .then((text) => {
      window.words = text.split("\n");
      window.word =
        window.words[
          Math.floor(Math.random() * window.words.length)
        ].toUpperCase();
        console.log("遊戲的答案是：", window.word);
    });
};

pick_word();

let wordDic = {};
let keysList = [];

const coloringCharBox = async (i, value) => {
  var indicator = row * 5 + i;
  var element = document.getElementById("box" + indicator);
  keysList.push(document.getElementById("key" + value.charAt(i)));
  element.classList.remove("noneWithText");

  if (value.charAt(i) === window.word.charAt(i)) {
    wordDic[value.charAt(i)]--;
    element.classList.add("green");
    return;
  }
  if (wordDic.hasOwnProperty(value.charAt(i))) {
    var isAfter = false;
    for (let j = i + 1; j < 5; j++) {
      if (
        window.word.charAt(j) === value.charAt(i) &&
        window.word.charAt(j) === value.charAt(j)
      ) {
        element.classList.add("grey");
        isAfter = true;
        break;
      }
    }
    if (wordDic[value.charAt(i)] === 0) {
      element.classList.add("grey");
      return;
    }
    if (!isAfter) {
      element.classList.add("yellow");
      wordDic[value.charAt(i)]--;
      return;
    }
  }
  element.classList.add("grey");
  return;
};

const coloringKeyboardBox = async (j) => {
  if (keysList[j].querySelector("p").textContent === window.word.charAt(j)) {
    keysList[j].classList.remove("light-grey");
    keysList[j].classList.remove("yellow");
    await sleep(7); // to make sure the animation runs
    keysList[j].classList.add("green");
    return;
  }
  if (wordDic.hasOwnProperty(keysList[j].querySelector("p").textContent)) {
    keysList[j].classList.remove("light-grey");
    await sleep(7);
    keysList[j].classList.contains("green")
      ? null
      : keysList[j].classList.add("yellow");
    return;
  }
  keysList[j].classList.remove("light-grey");
  await sleep(7);
  keysList[j].classList.add("grey");
  return;
};

const winningAnimation = async () => {
  for (let i = 0; i < 5; i++) {
    document.getElementById("box" + (row * 5 + i)).classList.remove("zoomOut");
    document
      .getElementById("box" + (row * 5 + i))
      .classList.add("greenWithoutAnimation");
    document.getElementById("box" + (row * 5 + i)).classList.remove("green");
    document.getElementById("box" + (row * 5 + i)).classList.add("win");
    await sleep(100);
  }
};

const checkWord = async (value) => {
  wordDic = {};
  keysList = [];
  for (let i = 0; i < 5; i++) {
    wordDic[window.word.charAt(i)] = charcount(
      window.word,
      window.word.charAt(i)
    );
  }

  if (value === window.word) {
    window.totalTime = Date.now() - window.start;
  }

  for (let i = 0; i < 5; i++) {
    await coloringCharBox(i, value);
    await sleep(345);
  }

  for (let j = 0; j < keysList.length; j++) {
    await coloringKeyboardBox(j);
  }

  if (value === window.word) {
    await winningAnimation();
    await sleep(1000);
    result(true, window.totalTime);
    return;
  }
  if (row === 5 && value !== window.word) {
    result(false);
    return;
  }
  row++;
};

const charcount = (word, letter) => {
  var letter_Count = 0;
  for (var position = 0; position < word.length; position++) {
    if (word.charAt(position) == letter) {
      letter_Count += 1;
    }
  }
  return letter_Count;
};

const result = (status, totalTime = 0) => {
  gameStarted = false;
  if (status) {
    const seconds = Math.floor(totalTime / 1000);
    const minutes = Math.floor(seconds / 60);
    window.time = `${
      minutes !== 0 ? minutes + ` 分${minutes == 1 ? "" : ""} ` : ""
    } ${seconds % 60} 秒${seconds % 60 == 1 ? "" : ""}`;
  }
  document.getElementById("result").querySelector("h1").textContent = status
    ? "你贏了！"
    : "你輸了！";
  document.getElementById("resultTop").textContent = status
    ? "你使用了"
    : "正確單字為";
  document.getElementById("time").textContent = status
    ? window.time
    : window.word;
  document.getElementById("resultBottom").textContent = status
    ? "答案:"+window.word
    : "";
  document.getElementById("black-overlay").classList.remove("hide");
  document.getElementById("result").classList.remove("hide");
  document
    .getElementById("black-overlay")
    .classList.add("fadeInForBlackOverlay");
  document.getElementById("result").classList.add("fadeIn");
  document.getElementById("keyboard").style.display = "none";
  document.getElementById("restart").style.display = "block";
};

const dispose = async () => {
  document
    .getElementById("black-overlay")
    .classList.remove("fadeInForBlackOverlay");
  document.getElementById("result").classList.remove("fadeIn");
  document.getElementById("black-overlay").classList.add("fadeOut");
  document.getElementById("result").classList.add("fadeOut");
  await sleep(190);
  document.getElementById("black-overlay").classList.add("hide");
  document.getElementById("result").classList.add("hide");
};

const reset = async () => {
  document.getElementById("restart").style.display = "none";
  document.getElementById("keyboard").style.display = "table";
  gameStarted = false;
  window.word = "";
  window.words = [];
  pick_word();
  row = 0;
  currentBox = -1;
  for (let i = 0; i < 30; i++) {
    var box = document.getElementById("box" + i);
    box.classList.remove("greenWithoutAnimation");
    box.classList.remove("win");
    box.classList.remove("zoomOut");
    box.classList.remove("green");
    box.classList.remove("yellow");
    box.classList.remove("grey");
    box.classList.add("none");
    box.querySelector("p").textContent = "";
  }
  for (let i = 0; i < 26; i++) {
    var key = document.getElementById("key" + String.fromCharCode(65 + i));
    key.classList.remove("green");
    key.classList.remove("yellow");
    key.classList.remove("grey");
    key.classList.add("light-grey");
  }
  dispose();
};

window.onload = function() {
  Swal.fire({
    title: '更新',
    html: '單字題庫為<b>110年版</b>並非最新<b>113年</b><br>故部分單字可能尚未出現過',
    icon: 'info',
  });
}