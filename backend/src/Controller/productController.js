const prisma = require("../../prisma");

const existingProduct = async (name) => {
  return await prisma.product.findUnique({
    where: { name },
  });
};

const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json("Products fetched successfully", products);
};

const singleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    return res.status(404).json("Product not found");
  }
  res.json("Product fetched successfully", product);
};

const createProduct = async (req, res) => {
  const { name, price, gstPercent } = req.body;
  const existingProduct = await existingProduct(name);
  if (existingProduct) {
    return res.status(400).json("Product already exists");
  } 
  const product = await prisma.product.create({
    data: {
      name,
      price,
      gstPercent,
    },
  });
  res.json("Product created successfully", product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, gstPercent } = req.body;
  const existingProduct = await existingProduct(id);
  if (!existingProduct) {
    return res.status(404).json("Product not found");
  }
  
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      gstPercent,
    },
  });
  res.json("Product updated successfully", product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const existingProduct = await existingProduct(id);
  if (!existingProduct) {
    return res.status(404).json("Product not found");
  }
  await prisma.product.delete({
    where: { id },
  });
  res.json("Product deleted successfully");
};

const filterProducts = async (req, res) => {
  try {
    const { name, sort, price } = req.query;

    let where = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    let orderBy = {
      createdAt: "desc",
    };

    if (sort === "asc") {
      orderBy = {
        name: "asc",
      };
    }

    if (sort === "desc") {
      orderBy = {
        name: "desc",
      };
    }

    if (price === "high") {
      orderBy = {
        price: "desc",
      };
    }

    if (price === "low") {
      orderBy = {
        price: "asc",
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
};
