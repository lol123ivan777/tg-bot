const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./tricks.json', 'utf8'));

const random = arr => arr[Math.floor(Math.random() * arr.length)];

const getUno = () => random(data.tricksUno);
const getDos = () => random(data.tricksDos);
const getTri = () => random(data.tricksTri);
const getHard = () => random(data.tricksHard);

const getComboCherez = () => random(data.comboCherezTemp);
const getComboVTemp = () => random(data.comboVTemp);
const getComboHard = () => random(data.comboHardcore);

const getAny = () =>
  random([
    ...data.tricksUno,
    ...data.tricksDos,
    ...data.tricksTri,
    ...data.tricksHard,
    ...data.comboCherezTemp,
    ...data.comboVTemp,
    ...data.comboHardcore,
  ]);

module.exports = {
  getUno,
  getDos,
  getTri,
  getHard,
  getComboCherez,
  getComboVTemp,
  getComboHard,
  getAny,
};