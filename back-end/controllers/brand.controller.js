const BrandModel = require("../models/brand.model");

const getBrandList = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    const brand = await BrandModel.getAllBrand(limit, offset);
    const brandQuantity = await BrandModel.countAllBrand();
    return res.status(200).json({ count: brandQuantity, data: brand });
  } catch (error) {
    res.status(400).json({ message: "Tải danh sách thương hiệu thất bại!" });
  }
};

module.exports = {
  getBrandList,
};
