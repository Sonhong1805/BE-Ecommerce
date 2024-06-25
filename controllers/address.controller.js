const { provinces } = require("../data/provinces.data");
let { districts } = require("../data/districts.data");
let { wards } = require("../data/wards.data");

exports.getProvinces = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { provinces },
  });
};
exports.getDistricts = (req, res) => {
  const { parent_code } = req.query;
  const filterDistricts = districts.filter(
    (district) => district.parent_code === parent_code
  );
  res.status(200).json({
    status: "success",
    data: { districts: filterDistricts },
  });
};
exports.getWards = (req, res) => {
  const { parent_code } = req.query;
  const filterWards = wards.filter((ward) => ward.parent_code === parent_code);
  res.status(200).json({
    status: "success",
    data: { wards: filterWards },
  });
};
