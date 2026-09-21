/**
 * snap.jsx — writes PNG stills out of a comp so the build can be looked at.
 *
 * The bridge has no render tool and none is wanted: this is the QA loop, not a
 * delivery. Frames are named by their frame number so a still can be compared
 * against the same frame in Remotion Studio.
 */
(function () {
  var cfg = { comp: "MovingAverageBollingerBands", frames: [60, 300, 500, 640], dir: "/Users/samuelsurja/adobe-scripts/ma/still" };
  var f = new File("/Users/samuelsurja/adobe-scripts/ma/snap.json");
  if (f.exists) { f.open("r"); cfg = eval("(" + f.read() + ")"); f.close(); }

  var c = null;
  for (var i = 1; i <= app.project.numItems; i++) {
    var it = app.project.item(i);
    if (it instanceof CompItem && it.name === cfg.comp) { c = it; break; }
  }
  if (!c) return "NO COMP " + cfg.comp;

  var dir = new Folder(cfg.dir);
  if (!dir.exists) dir.create();
  var done = [];
  for (var k = 0; k < cfg.frames.length; k++) {
    var fr = cfg.frames[k];
    var out = new File(cfg.dir + "/f" + fr + ".png");
    c.saveFrameToPng(fr / c.frameRate, out);
    done.push(fr);
  }
  return "saved " + done.length + " stills from " + cfg.comp + ": " + done.join(",");
})();
