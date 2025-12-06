const fs = require("fs");
const data = JSON.parse(fs.readFileSync("./tricks.json","utf8"));

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
  //========= одинарные===
function getUno() {
  return random(data.tricksUno);
}

function getDos() {
  return random(data.tricksDos);
}

function getTri() {
  return random(data.tricksTri);
}

  //-------- combo -----
function getComboCherez() {
  return random(data.comboCherezTemp);
}

function getComboVTemp() {
  return random(data.comboVTemp);
}

function getComboHard() {
  return random(data.comboHardcore);
}

  //-------- random  ----
function getAny() {
  return random([
    ...data.tricksUno,
    ...data.tricksDos,
    ...data.tricks.Tri,
    ...data.tricks.comboCherezTemp,
    ...data.tricks.comboVTemp,
    ...data.tricksHardcore,
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
