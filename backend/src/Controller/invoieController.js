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
    console.log("pdf called ");
    
    const { id } = req.params;
    console.log(id);
    

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
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // Helper function to draw line
    const drawLine = (y) => {
      doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    };

    // Helper function for currency formatting
    const formatCurrency = (amount) => {
      return `₹${Number(amount).toFixed(2)}`;
    };

    // Company Header with Logo
    doc.rect(50, 45, 500, 70).fillAndStroke("#f8f9fc", "#e0e0e0");
    
    // Company Name
    doc.fillColor("#2c3e50")
       .fontSize(28)
       .font("Helvetica-Bold")
       .text("INVOICE", 70, 60);
    
    doc.fillColor("#7f8c8d")
       .fontSize(12)
       .font("Helvetica")
       .text("Tax Invoice / Bill of Supply", 70, 95);

    // Company Details (Right Side) - UPDATED with your data
    doc.fillColor("#2c3e50")
       .fontSize(10)
       .font("Helvetica-Bold")
       .text("RADHE JUNRAL STORES", 350, 60);
    
    doc.fillColor("#7f8c8d")
       .fontSize(8)
       .font("Helvetica")
       .text("105 mamadev chowk", 350, 75)
       .text("kamrej, gujrat - 394180", 350, 88)
       .text("GSTIN: 278754219636165", 350, 101)
       .text("contact@RADHE.com | +91 87542 19636", 350, 114);

    drawLine(125);

    // Invoice Details Section
    doc.fillColor("#2c3e50")
       .fontSize(10)
       .font("Helvetica-Bold")
       .text("Invoice Details", 50, 140);
    
    // Invoice Info Box
    doc.rect(50, 155, 240, 70).fillAndStroke("#ffffff", "#e0e0e0");
    doc.rect(310, 155, 240, 70).fillAndStroke("#ffffff", "#e0e0e0");

    // Left Box - Invoice Details
    doc.fillColor("#34495e")
       .fontSize(9)
       .font("Helvetica-Bold")
       .text("Invoice Number:", 60, 170)
       .text("Invoice Date:", 60, 190)
       .text("Due Date:", 60, 210);
    
    doc.fillColor("#2c3e50")
       .font("Helvetica")
       .text(invoice.invoiceNumber || 'N/A', 150, 170)
       .text(new Date(invoice.createdAt).toLocaleDateString('en-IN', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
       }), 150, 190)
       .text(new Date(invoice.dueDate || invoice.createdAt).toLocaleDateString('en-IN', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
       }), 150, 210);

    // Right Box - Additional Info - UPDATED with your values
    doc.fillColor("#34495e")
       .font("Helvetica-Bold")
       .text("Place of Supply:", 320, 170)
       .text("Reverse Charge:", 320, 190)
       .text("Payment Terms:", 320, 210);
    
    doc.fillColor("#2c3e50")
       .font("Helvetica")
       .text("Gujrat (24)", 410, 170)  // Updated to Gujrat
       .text("No", 410, 190)            // Fixed "10000" to "No"
       .text("Net 30", 410, 210);

    drawLine(235);

    // Bill To / Ship To Section
    doc.fillColor("#2c3e50")
       .fontSize(10)
       .font("Helvetica-Bold")
       .text("Bill To:", 50, 250);
    
    // Customer Details Box
    doc.rect(50, 265, 240, 80).fillAndStroke("#ffffff", "#e0e0e0");
    doc.rect(310, 265, 240, 80).fillAndStroke("#ffffff", "#e0e0e0");

    // Customer Details
    doc.fillColor("#34495e")
       .fontSize(9)
       .font("Helvetica-Bold")
       .text("Customer Name:", 60, 280)
       .text("Phone:", 60, 300)
       .text("Email:", 60, 320);
    
    doc.fillColor("#2c3e50")
       .font("Helvetica")
       .text(invoice.customer?.name || 'N/A', 150, 280)
       .text(invoice.customer?.phone || 'N/A', 150, 300)
       .text(invoice.customer?.email || 'N/A', 150, 320);

    // Shipping Details (Right Box)
    doc.fillColor("#34495e")
       .font("Helvetica-Bold")
       .text("Shipping Address:", 320, 280)
       .text("Place of Delivery:", 320, 320);
    
    doc.fillColor("#2c3e50")
       .font("Helvetica")
       .text(invoice.customer?.address || 'Same as billing', 410, 280, { width: 130 })
       .text("Gujrat (24)", 410, 320);  // Updated to Gujrat

    drawLine(355);

    // Items Table Header
     const tableTop = 370;

     const col = {
       sn: 55,
       desc: 85,
       qty: 265,
       price: 305,
       gstp: 350,
       gsta: 395,
       total: 450
     };
    
    // Table Header Background
   doc.rect(50, tableTop, 500, 25).fill("#34495e");
   
   doc.fillColor("#ffffff")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("#", col.sn, tableTop + 8)
      .text("Product Description", col.desc, tableTop + 8)
      .text("Qty", col.qty, tableTop + 8, { width: 30, align: "right" })
      .text("Price", col.price, tableTop + 8, { width: 40, align: "right" })
      .text("GST %", col.gstp, tableTop + 8, { width: 35, align: "right" })
      .text("GST Amt", col.gsta, tableTop + 8, { width: 45, align: "right" })
      .text("Total", col.total, tableTop + 8, { width: 60, align: "right" });
    // Table Rows
    let yPosition = tableTop + 35;

        invoice.items.forEach((item, index) => {
          const itemTotal = item.quantity * item.price;
          const gstAmount = (itemTotal * item.gstPercent) / 100;
          const finalTotal = itemTotal + gstAmount;
        
          if (index % 2 === 0) {
            doc.rect(50, yPosition - 5, 500, 22).fill("#f8f9fc");
          }
        
          doc.fillColor("#2c3e50")
             .fontSize(9)
             .font("Helvetica")
             .text(index + 1, col.sn, yPosition)
             .text(item.productName, col.desc, yPosition, { width: 160 })
             .text(item.quantity.toString(), col.qty, yPosition, { width: 30, align: "right" })
             .text(formatCurrency(item.price), col.price, yPosition, { width: 40, align: "right" })
             .text(`${item.gstPercent}%`, col.gstp, yPosition, { width: 35, align: "right" })
             .text(formatCurrency(gstAmount), col.gsta, yPosition, { width: 45, align: "right" })
             .text(formatCurrency(finalTotal), col.total, yPosition, { width: 60, align: "right" });
        
          yPosition += 25;
        });

    doc.strokeColor("#cccccc").lineWidth(1);
    
    doc.moveTo(50, tableTop).lineTo(50, yPosition - 5).stroke();
    doc.moveTo(280, tableTop).lineTo(280, yPosition - 5).stroke();
    doc.moveTo(330, tableTop).lineTo(330, yPosition - 5).stroke();
    doc.moveTo(380, tableTop).lineTo(380, yPosition - 5).stroke();
    doc.moveTo(440, tableTop).lineTo(440, yPosition - 5).stroke();
    doc.moveTo(500, tableTop).lineTo(500, yPosition - 5).stroke();
    doc.moveTo(550, tableTop).lineTo(550, yPosition - 5).stroke();
    
    doc.moveTo(50, yPosition - 5).lineTo(550, yPosition - 5).stroke();

const subtotal = invoice.items.reduce(
  (sum, item) => sum + (item.quantity * item.price),
  0
);

const totalGST = invoice.items.reduce((sum, item) => {
  const itemTotal = item.quantity * item.price;
  return sum + (itemTotal * item.gstPercent / 100);
}, 0);

   const summaryY = yPosition + 30;

      doc.rect(330, summaryY, 220, 110)
         .fillAndStroke("#ffffff", "#e0e0e0");
      
      doc.fillColor("#34495e")
         .fontSize(9)
         .font("Helvetica-Bold")
         .text("Subtotal:", 340, summaryY + 20)
         .text("Total GST:", 340, summaryY + 40)
         .text("Shipping:", 340, summaryY + 60)
         .text("Grand Total:", 340, summaryY + 85);
      
      doc.fillColor("#2c3e50")
         .font("Helvetica")
         .text(formatCurrency(subtotal), 480, summaryY + 20, { width: 60, align: "right" })
         .text(formatCurrency(totalGST), 480, summaryY + 40, { width: 60, align: "right" })
         .text("₹0.00", 480, summaryY + 60, { width: 60, align: "right" });
      
      doc.fillColor("#27ae60")
         .font("Helvetica-Bold")
         .fontSize(11)
         .text(formatCurrency(invoice.total), 480, summaryY + 85, { width: 60, align: "right" });

    doc.fillColor("#7f8c8d")
       .fontSize(8)
       .font("Helvetica")
       .text(
         `Amount in words: ${numberToWords(invoice.total)} Only`,
         50,
         summaryY + 20,
         { width: 260 }
       );

    doc.fillColor("#2c3e50")
       .fontSize(10)
       .font("Helvetica-Bold")
       .text("Bank Details:", 50, summaryY + 60);
    
    doc.fillColor("#7f8c8d")
       .fontSize(8)
       .font("Helvetica")
       .text("Account Name: RADHE JUNRALS", 50, summaryY + 80)
       .text("Account Number: 857496123202", 50, summaryY + 95)
       .text("IFSC Code: SBIN0009515", 50, summaryY + 110)
       .text("Bank: State Bank of India, GUJRAT", 50, summaryY + 125);

    // Footer
    const footerY = 720;
    drawLine(footerY - 10);
    
    doc.fillColor("#95a5a6")
       .fontSize(8)
       .font("Helvetica")
       .text("This is a computer generated invoice", 50, footerY, { align: 'center', width: 500 })
       .text("Thank you for your business!", 50, footerY + 15, { align: 'center', width: 500 });

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