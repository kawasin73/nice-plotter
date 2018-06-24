export function randomCircle(x, y, size) {
  const theta = 2 * Math.PI * Math.random();
  const r = Math.sqrt(Math.random() * Math.pow(size, 2));
  return { x: Math.trunc(r * Math.cos(theta) + x), y: Math.trunc(r * Math.sin(theta) + y) }
}

// URL: https://qiita.com/gigamori/items/e17e6f9faffb78822c56
export function rnorm() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

export function randomNorm(x, y, size) {
  return { x: Math.trunc(rnorm() * size / 2 + x), y: Math.trunc(rnorm() * size / 2 + y) }
}

export function getPosition(e) {
  const rect = e.target.getBoundingClientRect();
  const mouseX = (e.clientX || e.touches[0].clientX) - Math.floor(rect.left) - 2;
  const mouseY = (e.clientY || e.touches[0].clientY) - Math.floor(rect.top) - 2;
  return { x: mouseX, y: mouseY };
}

// URL: https://st40.xyz/one-run/article/133/
export function Base64toBlob(base64) {
  // カンマで分割して以下のようにデータを分ける
  // tmp[0] : データ形式（data:image/png;base64）
  // tmp[1] : base64データ（iVBORw0k～）
  const tmp = base64.split(',');
  // base64データの文字列をデコード
  const data = atob(tmp[1]);
  // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
  const mime = tmp[0].split(':')[1].split(';')[0];
  //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
  const buf = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buf[i] = data.charCodeAt(i);
  }
  return new Blob([buf], { type: mime });
}

export function saveBlob(blob, fileName) {
  const url = (window.URL || window.webkitURL);
  const dataUrl = url.createObjectURL(blob);
  const event = document.createEvent("MouseEvents");
  event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  a.href = dataUrl;
  a.download = fileName;
  a.dispatchEvent(event);
}
