export const fredUnits = {
  lin: "levels",
  chg: "change",
  ch1: "change from year ago",
  pch: "percent change",
  pc1: "percent change from year ago",
  pca: "compounded annual rate of change",
  cch: "contiously compounded rate of change",
  cca: "continously compounded annual rate of change",
  log: "natural log"
}

export function template(strings, ...keys) {
  return (function (...values) {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach(function (key, i) {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
export function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}