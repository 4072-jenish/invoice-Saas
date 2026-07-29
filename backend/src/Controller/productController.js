
const prisma = require("../../prisma");

// ===================== Helper Functions =====================

const findProductByName = async (name) => {
  return await prisma.product.findFirst({
    where: {
      name,
    },
  });
};

const findProductById = async (id) => {
  return await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });
};

// ===================== Get All Products =====================

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

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

// ===================== Get Single Product =====================

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await findProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===================== Create Product =====================

const createProduct = async (req, res) => {
  try {

    const userId = req.userId; // ✅ Correct

    const { name, price, gstPercent, stock } = req.body;

    const existedProduct = await findProductByName(name);

    if (existedProduct) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    const product = await prisma.product.create({
      data: {
        userId,
        name,
        price,
        gstPercent,
        stock,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};
// ===================== Update Product =====================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, gstPercent, stock } = req.body;
    console.log("updateProduct", id, name, price, gstPercent, stock)

    const existedProduct = await findProductById(id);

    if (!existedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        price,
        gstPercent,
        stock,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===================== Delete Product =====================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existedProduct = await findProductById(id);

    if (!existedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===================== Filter Products =====================

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

const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        userId: req.userId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        isDisabled: !product.isDisabled,
      },
    });

    return res.status(200).json({
      message: updatedProduct.isDisabled
        ? "Product disabled successfully"
        : "Product enabled successfully",
      product: updatedProduct,
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
  toggleProductStatus
};