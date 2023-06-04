
// ラジアンに変換
function radian(val) {
  return (val * Math.PI) / 180;
}

// ランダムな数
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// 線形補間
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

// 値をパーセンテージに変換
function valueToPercentage(value, total) {
  return (value / total) * 100;
}

// パーセンテージをラジアンに変換
function percentageToRadians(percentage) {
  return (percentage / 100) * (2 * Math.PI);
}

export {radian, random, lerp, valueToPercentage, percentageToRadians};