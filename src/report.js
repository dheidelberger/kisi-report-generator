import JSPDF from 'jspdf';
import format from 'date-fns/format';

const lrMargin = 72;
const tbMargin = 72;

const paperSize = 'letter';

const gray = '#808080';
const black = 0;
const white = '#ffffff';
const headerBlue = '#2f5496';
const oddGray = '#f2f2f2';
const evenBlue = '#ced9f0';

export default class Report {
  constructor() {
    this.doc = new JSPDF({
      orientation: 'p',
      unit: 'pt',
      format: paperSize,
      putOnlyUsedFonts: true,
    });
    this.currentPage = 1;
    this.yPos = 0;
    this.table = {};
    this.startPage = 0;
    this.pageCount = 0;
    this.firstReport = true;
  }

  save(filename) {
    this.doc.save(`${filename}.pdf`);
  }

  makeReport(date, rawData) {
    const headers = ['Name/Email', 'Time'];
    const dateString = format(date, 'dddd, MMMM D, YYYY');
    if (!this.firstReport) {
      this.doc.addPage(paperSize);
      this.currentPage += 1;
    }

    this.firstReport = false;

    // console.log(`Generating report for: ${dateString}`);
    // console.log(`Starting on page: ${this.currentPage}`);

    this._drawHeader(dateString, false);

    this.startPage = this.currentPage;
    this.pageCount = 1;

    let data = [];

    if (rawData.length > 0) {
      this._initTable(2, [0.7, 0.3], 6, 8);
      this._drawHeaderRow(headers);

      let i = 0;

      data = rawData.map((aRow) => {
        const formatted = format(aRow[1], 'hh:mm A');
        return [aRow[0], formatted];
      });

      // console.log(data);

      while (i < data.length) {
        const thisRow = data[i];

        // let timeFormat = format(thisRow[1],'h:mm A');
        const timeFormat = thisRow[1];

        thisRow[1] = timeFormat;

        const bgColor = (i % 2 === 1) ? oddGray : evenBlue;

        const rowOkay = this._drawRow(thisRow, 12, black, 'helvetica', 'normal', bgColor);

        if (rowOkay) {
          i += 1;
        } else {
          this.doc.addPage(paperSize);
          this._drawHeader(dateString, true);
          this._drawHeaderRow(headers);
          this.currentPage += 1;
          this.pageCount += 1;
        }
      }
    } else {
      this._initTable(1, [1], 8, 8);
      this._drawHeaderRow(['No entries today']);
    }

    for (let o = 1; o <= this.pageCount; o++) {
      this.doc.setPage(this.startPage + o - 1);
      this._drawFooter(dateString, o);
    }
  }

  _drawFooter(dateString, pageNumber) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(gray);

    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;


    this.doc.text(`Attendance Report: ${dateString}`, lrMargin, pageHeight - tbMargin + 15);
    this.doc.text(`Attendance Report: ${dateString}`, lrMargin, pageHeight - tbMargin + 15);
    this.doc.text(`Page ${pageNumber} of ${this.pageCount}`, pageWidth - lrMargin, pageHeight - tbMargin + 15, { align: 'right' });
  }

  _drawHeaderRow(headers) {
    this._drawRow(headers, 14, white, 'helvetica', 'bold', headerBlue);
  }

  _initTable(columnCount, widths, tableTBMargin, lMargin) {
    this.table = {
      columnCount,
      widths,
      tableTBMargin,
      lMargin,
    };
  }

  _getStartPercentForCol(idx) {
    if (idx === 0) {
      return 0;
    }
    let total = 0;
    for (let i = 0; i < idx; i++) {
      total += this.table.widths[i];
    }

    return total;
  }

  _drawRow(text, fontSize, fontColor, fontName, fontStyle, fillColor) {
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(fontColor);
    this.doc.setFont(fontName, fontStyle);
    this.doc.setFillColor(fillColor);
    this.doc.setDrawColor(black);
    this.doc.setLineWidth(1);

    const textHeight = this.doc.getLineHeight();

    const rowHeight = (textHeight) + (this.table.tableTBMargin * 2);

    const halfRectHeight = rowHeight / 2;
    const halfLineHeight = textHeight / 2;

    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;

    // Row will go over margins, return and we'll try again
    if ((this.yPos + rowHeight) > (pageHeight - tbMargin)) {
      return false;
    }


    const rowWidth = pageWidth - (lrMargin * 2);
    const startY = this.yPos + halfRectHeight + halfLineHeight;

    this.doc.rect(lrMargin, this.yPos, rowWidth, rowHeight, 'FD');


    for (let i = 0; i < this.table.columnCount; i++) {
      const totalPerc = this._getStartPercentForCol(i);

      const x = lrMargin + totalPerc * rowWidth;

      this.doc.line(x, this.yPos, x, this.yPos + rowHeight);
    }

    text.forEach((aCol, index) => {
      const startX = lrMargin + rowWidth * this._getStartPercentForCol(index) + this.table.lMargin;
      this.doc.text(aCol, startX, startY, { baseline: 'bottom' });
    });

    this.yPos += rowHeight;

    return true;
  }

  _drawHeader(dateString, continued = false) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(gray);

    this.yPos = tbMargin;

    this.doc.text('attendance report for', lrMargin, this.yPos);
    this.doc.setTextColor(black);
    this.doc.setFontSize(22);

    this.yPos += 22;
    this.doc.text(dateString, lrMargin, this.yPos);

    if (continued) {
      this.yPos += 16;
      this.doc.setTextColor(gray);
      this.doc.setFontSize(12);
      this.doc.text('(continued)', lrMargin, this.yPos);
    }

    this.yPos += 36;
  }
}


// initDocument();
// makeReport("March 6, 2019",data);
