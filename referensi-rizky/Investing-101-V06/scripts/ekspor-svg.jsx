// ekspor-svg.jsx — buka berkas vektor (.ai/.eps) di Illustrator, ekspor SVG (atribut presentasi, teks jadi garis), tutup TANPA menyimpan.
// Jalur masuk/keluar dibaca dari berkas teks di sebelah skrip ini (baris 1 = masuk, baris 2 = keluar).
(function () {
  var cfg = new File($.fileName.replace(/[^\/]+$/, '') + 'ekspor-svg.txt');
  cfg.open('r'); var masuk = cfg.readln(); var keluar = cfg.readln(); cfg.close();
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  var doc = app.open(new File(masuk));
  var opt = new ExportOptionsSVG();
  opt.embedRasterImages = true;
  opt.fontType = SVGFontType.OUTLINEFONT;
  opt.coordinatePrecision = 2;
  opt.documentEncoding = SVGDocumentEncoding.UTF8;
  opt.DTD = SVGDTDVersion.SVG1_1;
  opt.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
  doc.exportFile(new File(keluar), ExportType.SVG, opt);
  doc.close(SaveOptions.DONOTSAVECHANGES);
})();
