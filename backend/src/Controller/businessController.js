
const prisma = require("../../prisma");

const addBusiness = async (req , res) => {
    try {
    const { businessName, gstNumber, address } = req.body;

    const existing = await prisma.business.findFirst({
      where: { userId: req.userId },
    });
 
    if (existing) {
      const updated = await prisma.business.update({
        where: { id: existing.id },
        data: { businessName, gstNumber, address },
      });
      return res.json(updated);
    }

    const business = await prisma.business.create({
      data: {
        userId: req.userId,
        businessName,
        gstNumber,
        address,
      },
    });

    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    addBusiness
}