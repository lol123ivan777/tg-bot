const fs = require("fs");

let data;
try {
  data = JSON.parse(fs.readFileSync("./tricks.json", "utf8"));
} catch (err) {
  console.error("Ошибка чтения tricks.json:", err);
  data = {
    tricksUno: [],
    tricksDos: [],
    tricksTri: [],
    comboCherezTemp: [],
    comboVTemp: [],
    comboHardcore: []
  };
}

function random(arr) {
  if (!arr || arr.length === 0) return "⚠ Нет данных в JSON";
  return arr[Math.floor(Math.random() * arr.length)];
}

//====== одиночные ======
function getUno() {
  return random(data.tricksUno);
}

function getDos() {
  return random(data.tricksDos);
}

function getTri() {
  return random(data.tricksTri);
}

//====== комбо ======
function getComboCherez() {
  return random(data.comboCherezTemp);
}

function getComboVTemp() {
  return random(data.comboVTemp);
}

function getComboHard() {
  return random(data.comboHardcore);
}

//====== все подряд ======
function getAny() {
  return random([
    ...data.tricksUno,
    ...data.tricksDos,
    ...data.tricksTri,
    ...data.comboCherezTemp,
    ...data.comboVTemp,
    ...data.comboHardcore,
  ]);
}

module.exports = {
  getUno,
  getDos,
  getTri,
  getComboCherez,
  getComboVTemp,
  getComboHard,
  getAny
};