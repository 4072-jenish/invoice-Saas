const PDFDocument = require("pdfkit");
const prisma = require('../../prisma');

const creatInvoice = async (req , res) => {
    try {
      console.log(req.body);
    const { customerId, items } = req.body;

    let total = 0;
    let gstAmount = 0;
     if (!items || !Array.isArray(items)) {
      console.log("Bhaiya item nahi aa rahi ");
      
       return res.status(400).json({ message : "Items was Empty"});
     }
    
    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const gst = (itemTotal * item.gstPercent) / 100;

      total += itemTotal + gst;
      gstAmount += gst;
    });

    const invoiceCount = await prisma.invoice.count({
           where: { userId: req.userId },
    });

    const invoiceNumber = `INV-${invoiceCount + 1}`;

    const invoice = await prisma.invoice.create({
      data: {
        userId: req.userId,
        customerId : Number(customerId)  ,
        invoiceNumber : invoiceNumber,
        status : req.body.status,
        total,
        gstAmount,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    console.log(invoice);
    
    
    res.json(invoice);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

const allInvoice = async (req , res ) => {
   try {
      console.log("all Invoices called");
      
    const invoices = await prisma.invoice.findMany({
        where : {
          customer : {
            isDeleted : false
          }
        },
       include: {
         customer : true,
         items : true
       },
       orderBy: {
        createdAt : "desc"
       }
    });
    

    res.json(invoices);
   } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
   }
}


const getInvoice = async (req, res) => {
  try {
    console.log("get Invoice called");

    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        customer: true,
        items: true
      }
    });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch {
    res.status(500).json({ error: err.message });
  }
}

const editInvoice = async (req, res) => {
  try {
    console.log("edit Invoice called");

    const { id } = req.params;
    const { customerId, items } = req.body;

    let total = 0;
    let gstAmount = 0;

    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const gst = (itemTotal * item.gstPercent) / 100;
condition
      total += itemTotal + gst;
      gstAmount += gst;
    });

    const invoice = await prisma.invoice.update({
      where: { id: Number(id) },
      data: {
        customerId: Number(customerId),
      }
    })
    res.status(200).json({message : "invoice updated successfully"}, invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteInvoice = async (req, res) => {
  try {
    console.log("delete Invoice called");

    const { id } = req.params;

    const invoice = await prisma.invoice.delete({
      where: { id: Number(id) },
    });
    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: { customer: true, items: true }
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

    const drawLine = (y) => {
      doc
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(545, y)
        .stroke();
    };

    /* ----------------------------------
        HEADER
    ---------------------------------- */

    doc
      .fontSize(28)
      .fillColor("#1e40af")
      .font("Helvetica-Bold")
      .text("INVOICE", 50, 50);

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("Tax Invoice / Bill of Supply", 50, 85);

    doc
      .fontSize(11)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text("RADHE Electrics", 350, 50);

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("105 Mamadev Chowk", 350, 70)
      .text("Kamrej, Gujarat - 394180", 350, 85)
      .text("GSTIN: 278754219636165", 350, 100)
      .text("contact@radhe.com | +91 87542 19636", 350, 115);

    drawLine(130);

    /* ----------------------------------
        INVOICE INFO
    ---------------------------------- */

    doc
      .fontSize(11)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text("Invoice Details", 50, 150);

    doc
      .fontSize(9)
      .fillColor("#374151")
      .font("Helvetica")
      .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 170)
      .text(
        `Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString(
          "en-IN"
        )}`,
        50,
        185
      )
      .text(
        `Due Date: ${new Date(
          invoice.dueDate || invoice.createdAt
        ).toLocaleDateString("en-IN")}`,
        50,
        200
      );

    doc
      .text("Place of Supply: Gujarat (24)", 350, 170)
      .text("Reverse Charge: No", 350, 185)
      .text("Payment Terms: Net 30", 350, 200);

    drawLine(220);

    /* ----------------------------------
        BILL TO
    ---------------------------------- */

    doc
      .fontSize(11)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text("Bill To", 50, 240);

    doc
      .fontSize(9)
      .fillColor("#374151")
      .font("Helvetica")
      .text(`Customer: ${invoice.customer?.name || "N/A"}`, 50, 260)
      .text(`Phone: ${invoice.customer?.phone || "N/A"}`, 50, 275)
      .text(`Email: ${invoice.customer?.email || "N/A"}`, 50, 290);

    drawLine(310);

    /* ----------------------------------
        TABLE
    ---------------------------------- */

const tableTop = 330;

const col = {
  sn: 55,
  desc: 90,
  qty: 320,
  price: 360,
  gstp: 430,
  total: 480
};

// Table Header
doc.rect(50, tableTop, 495, 25).fill("#1e40af");

doc
  .fillColor("#ffffff")
  .font("Helvetica-Bold")
  .fontSize(9)
  .text("#", col.sn, tableTop + 8)
  .text("Product", col.desc, tableTop + 8)
  .text("Qty", col.qty, tableTop + 8, { align: "left", width: 20 })
  .text("Price", col.price, tableTop + 8, { align: "left", width: 40 })
  .text("GST%", col.gstp, tableTop + 8, { align: "left", width: 20 })
  .text("Total", col.total, tableTop + 8, { align: "left", width: 50 });

let y = tableTop + 35;

invoice.items.forEach((item, i) => {

  const itemTotal = item.price * item.quantity;
  const gst = (itemTotal * item.gstPercent) / 100;
  const finalTotal = itemTotal + gst;

  if (i % 2 === 0) {
    doc.rect(50, y - 5, 495, 22).fill("#f9fafb");
  }

  doc
    .fillColor("#111827")
    .font("Helvetica")
    .fontSize(9)
    .text(i + 1, col.sn, y)
    .text(item.productName, col.desc, y, { width: 200 })
    .text(item.quantity, col.qty, y, { align: "left", width: 20 })
    .text(formatCurrency(item.price), col.price, y, { align: "left", width: 40 })
    .text(`${item.gstPercent}%`, col.gstp, y, { align: "left", width: 20 })
    .text(formatCurrency(finalTotal), col.total, y, { align: "left", width: 50 });

  y += 25;
});

drawLine(y);

    /* ----------------------------------
        TOTAL
    ---------------------------------- */

    const subtotal = invoice.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    const totalGST = invoice.items.reduce(
      (sum, i) => sum + (i.quantity * i.price * i.gstPercent) / 100,
      0
    );

    const summaryY = y + 20;

    doc
      .fontSize(9)
      .fillColor("#374151")
      .font("Helvetica")
      .text("Subtotal:", 400, summaryY)
      .text(formatCurrency(subtotal), 480, summaryY, { align: "right" });

    doc
      .text("GST:", 400, summaryY + 20)
      .text(formatCurrency(totalGST), 480, summaryY + 20, { align: "right" });

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#16a34a")
      .text("Grand Total:", 400, summaryY + 45)
      .text(formatCurrency(invoice.total), 480, summaryY + 45, {
        align: "right"
      });

    /* ----------------------------------
        FOOTER
    ---------------------------------- */

    const footerY = 720;

    drawLine(footerY - 10);

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text(`Amount in words: ${numberToWords(invoice.total)} Only`, 50, 650, {
        width: 300
      });

    doc
      .fontSize(8)
      .text("This is a computer generated invoice.", 50, footerY, {
        align: "center",
        width: 495
      })
      .text("Thank you for your business!", 50, footerY + 15, {
        align: "center",
        width: 495
      });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
// Helper function to convert number to words (improved version)
function numberToWords(num) {
  if (num === 0) return "Zero";
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
  
  // Handle decimal part
  const numStr = num.toFixed(2).toString();
  const [rupees, paise] = numStr.split('.');
  
  const numRupees = parseInt(rupees);
  
  if (numRupees === 0) return "Zero";
  
  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let result = '';
    
    if (hundred > 0) {
      result += ones[hundred] + ' Hundred ';
    }
    
    if (rest > 0) {
      if (rest < 10) {
        result += ones[rest];
      } else if (rest < 20) {
        result += teens[rest - 10];
      } else {
        const ten = Math.floor(rest / 10);
        const one = rest % 10;
        result += tens[ten];
        if (one > 0) {
          result += ' ' + ones[one];
        }
      }
    }
    
    return result.trim();
  }
  
  function convertIndianNumber(n) {
    if (n === 0) return '';
    
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const hundred = n % 1000;
    
    let result = '';
    
    if (crore > 0) {
      result += convertThreeDigits(crore) + ' Crore ';
    }
    if (lakh > 0) {
      result += convertThreeDigits(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      result += convertThreeDigits(thousand) + ' Thousand ';
    }
    if (hundred > 0) {
      result += convertThreeDigits(hundred);
    }
    
    return result.trim();
  }
  
  let words = convertIndianNumber(numRupees) + ' Rupee';
  if (numRupees !== 1) words += 's';
  
  if (paise && parseInt(paise) > 0) {
    const paiseNum = parseInt(paise);
    words += ' and ' + convertThreeDigits(paiseNum) + ' Paise';
    if (paiseNum !== 1) words += 's';
  }
  
  return words;
}
module.exports = { creatInvoice , allInvoice , getInvoice , deleteInvoice , editInvoice , generateInvoicePDF};