const { categories, filters } = require("../data/categories.data");

exports.getCategories = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
};

exports.getCategory = (req, res) => {
  const { slug } = req.query;
  const foundCategory = categories.find((category) => {
    const foundChild = category.children.find((child) => child.slug === slug);
    return foundChild !== undefined;
  });

  const objCategory =
    foundCategory !== undefined
      ? foundCategory.children.find((child) => child.slug === slug)
      : categories.find((category) => category.slug === slug);

  res.status(200).json({
    status: "success",
    objCategory,
  });
};

exports.getFilters = (req, res) => {
  const { slug } = req.query;
  const objCategory = categories.find((category) => {
    if (category.slug !== slug) {
      return category.children.some((child) => child.slug === slug);
    }
    return category.slug === slug;
  });

  let categoryId = null;
  if (objCategory) {
    categoryId = objCategory.id;
  }

  const filtersCategory = filters.find((item) => {
    if (categoryId === null) {
      return item.categoryId === null;
    }
    return item.categoryId === categoryId;
  });

  res.status(200).json({
    status: "success",
    data: filtersCategory,
  });
};
