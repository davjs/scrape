let data = document.querySelector('.highcharts-graph').getAttribute('d');

let lines = data
  .split(/M|L/)
  .map((line) => line.trim())
  .slice(1);
let points = lines.map((line) => {
  let xy = line.split(' ');
  return {
    x: Number(xy[0]),
    y: Number(xy[1]),
  };
});

let maxReal = document
  .querySelector('[data-e2e="tbs-quote-highest-value"]')
  .innerText.replace(',', '.');
let minReal = document
  .querySelector('[data-e2e="tbs-quote-lowest-value"]')
  .innerText.replace(',', '.');
let maxSVG = points.reduce((p, n) => Math.max(p, n.y), 0);
let minSVG = points.reduce((p, n) => Math.min(p, n.y), 100000000000000);

function InvLerp(a, b, v) {
  return (v - a) / (b - a);
}

function Lerp(a, b, t) {
  return (1.0 - t) * a + b * t;
}

let invLerped = points.map((p) => {
  return {
    x: p.x,
    y: 1 - InvLerp(minSVG, maxSVG, p.y),
  };
});

let lerped = invLerped.map((p) => {
  return {
    x: p.x,
    y: Lerp(minReal, maxReal, p.y),
  };
});

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

alert(
  'start: ' +
    lerped[0].y.toFixed(1) +
    '\nend: ' +
    lerped[lerped.length - 1].y.toFixed(1)
);

downloadObjectAsJson(lerped, 'test.json');
//
