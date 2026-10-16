const PDFDocument = require('pdfkit');
const BLUE = '#003366';
const GOLD = '#e6a827';

function renderReadingsPdf(readings) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 185, bottom: 65, left: 48, right: 48 },
      bufferPages: true, info: { Title: `Evangelio y lecturas - ${readings.date}`, Author: 'Camino de Fe', Subject: 'Lecturas del día. Fuente: Dominicos.org' } });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    try {
      const width = doc.page.width - 96;
      const header = () => {
        // Vector wordmark follows the main site's cross + serif name identity.
        doc.roundedRect(48, 28, width, 64, 9).fill('#182230');
        doc.save().translate(67, 46).scale(1.1);
        doc.path('M 10 0 L 16 0 L 16 9 L 24 9 L 24 15 L 16 15 L 16 25 L 10 25 L 10 15 L 2 15 L 2 9 L 10 9 Z')
          .lineWidth(1.8).lineJoin('round').strokeColor('#ffd700').stroke();
        doc.restore();
        doc.font('Times-Bold').fontSize(22).fillColor('#ffffff').text('Camino', 104, 42, { lineBreak: false });
        const nameWidth = doc.widthOfString('Camino ');
        doc.fillColor('#ffe888').text('de Fe', 104 + nameWidth, 42, { lineBreak: false });
        doc.font('Helvetica').fontSize(7).fillColor('#c3ccd6').text('PORTAL CATÓLICO', 105, 67, { characterSpacing: 1.1, lineBreak: false });
        const buttonX = doc.page.width - 48 - 156;
        doc.roundedRect(buttonX, 41, 138, 38, 6).fill('#fff4c2');
        doc.font('Helvetica').fontSize(7.5).fillColor(BLUE).text('VISITA NUESTRA WEB', buttonX, 49, { width: 138, align: 'center', characterSpacing: 0.4 });
        doc.font('Helvetica-Bold').fontSize(10).text('caminodefe.cl', buttonX, 62, { width: 138, align: 'center', characterSpacing: 0 });
        doc.link(buttonX, 41, 138, 38, 'https://caminodefe.cl');
        doc.font('Times-Roman').fontSize(26).fillColor(BLUE).text('Evangelio y lecturas', 48, 109, { width, align: 'center' });
        const date = new Date(`${readings.date}T12:00:00Z`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
        doc.font('Helvetica').fontSize(10).fillColor('#596775').text(date, 48, 142, { width, align: 'center' });
        doc.moveTo(48, 166).lineTo(doc.page.width - 48, 166).lineWidth(0.5).strokeColor('#dbe4ec').stroke();
        doc.moveTo(doc.page.width / 2 - 24, 166).lineTo(doc.page.width / 2 + 24, 166).lineWidth(2).strokeColor(GOLD).stroke();
        doc.x = 48; doc.y = 185;
      };
      header();
      const continuationHeader = () => {
        header();
        doc.font('Times-Roman').fontSize(11).fillColor('#263442');
      };
      doc.on('pageAdded', continuationHeader);
      for (const section of readings.sections) {
        // Give the Gospel a quiet, dedicated page; other readings flow naturally.
        if (section.kind === 'gospel' || doc.y > doc.page.height - 180) doc.addPage();
        doc.font('Helvetica-Bold').fontSize(11).fillColor(BLUE).text(section.title.toLocaleUpperCase('es'), { width });
        doc.moveDown(0.55);
        doc.font('Times-Bold').fontSize(12).fillColor(BLUE).text(section.reference, { width, lineGap: 2 });
        doc.moveDown(0.65);
        doc.font('Times-Roman').fontSize(11).fillColor('#263442');
        section.paragraphs.forEach(paragraph => {
          const height = doc.heightOfString(paragraph, { width, lineGap: 2 });
          if (height < doc.page.height - 250 && doc.y + height > doc.page.height - 65) doc.addPage();
          doc.text(paragraph, { width, lineGap: 2 });
          doc.moveDown(0.45);
        });
        doc.moveDown(0.8);
      }
      doc.removeListener('pageAdded', continuationHeader);
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        const y = doc.page.height - 45;
        doc.moveTo(48, y - 12).lineTo(doc.page.width - 48, y - 12).lineWidth(0.5).strokeColor('#dbe4ec').stroke();
        doc.font('Helvetica').fontSize(8).fillColor('#596775').text('Fuente de las lecturas: Dominicos.org', 48, y, { lineBreak: false });
        doc.link(48, y, 180, 10, readings.sourceUrl);
        doc.text(`${i + 1} / ${pages.count}`, doc.page.width - 80, y, { lineBreak: false });
      }
      doc.end();
    } catch (error) { doc.destroy(); reject(error); }
  });
}

module.exports = { renderReadingsPdf };
