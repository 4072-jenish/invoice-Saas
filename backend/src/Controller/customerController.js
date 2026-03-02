const prisma = require("../../prisma");

const addCustomer = async (req , res) => {
    try {
    const { name, phone, email } = req.body;

    const customer = await prisma.customer.create({
      data: {
        userId: req.userId,
        name,
        phone,
        email,
      }, 
    });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const allCustomers = async (req , res) => {
     const customers = await prisma.customer.findMany({
          where : {
         isDeleted: false 
        }
        });
     res.json(customers);
}
const getCustomer = async (req , res) => {
    const {id} = req.params; 
    const customers = await prisma.customer.findMany({
    where: { id: Number(id) , isDeleted : false},
  });

  res.json(customers);
}


const editCustomer = async (req , res) => {
    try {
      const { id } = req.params;
    const { name, phone, email } = req.body;

  const exsisting = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!exsisting) {
    return res.status(404).json({ message: "Customer not found"});
   }else{
    const customer = await prisma.customer.update({
      where: { id: Number(id) , isDeleted : false},
      data: {
        name,
        phone,
        email,
      },
    });
    res.json(customer);
    }
    } catch (error) {
      console.log(error);
      
       res.status(500).json({ error: error.message });
    }

}

const deleteCustomer = async ( req , res ) => {
     console.log("delete customer called");
     
    const { id } = req.params;

    const exsisting = await prisma.customer.findUnique({
        where: { id: Number(id) },
      });

      if (!exsisting) {
        return res.status(404).json({ message: "Customer not found"});
       }else{
        await prisma.customer.update({
          where: { id: Number(id) },
            data: { isDeleted: true }
        });
    } 
}

module.exports = {
    addCustomer,
    allCustomers, 
    getCustomer,
    editCustomer,
    deleteCustomer
}