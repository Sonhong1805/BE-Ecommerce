const FILE_PRODUCTS = require("../constants/file_products");
const fileManager = require("../fileManager");
const removeAccents = require("../helpers/removeAccents");

exports.getProducts = async (req, res) => {
  const productsData = await fileManager.readFile(FILE_PRODUCTS);
  const products = productsData && productsData.products;
  const {
    productName, //?productName=banh
    slugParent, //?slugParent=bach-hoa-online
    slugChildren, //?slugChildren[]=an-vat-banh-keo
    priceMin, //?category_parent=1&priceMin=8000
    priceMax, //?category_parent=1&priceMin=8000&priceMax=40000
    attribute, //?category_parent=1&attribute[]=color-yellow&attribute[]=color-white&attribute[]=address-ha noi
    sortTag, //?sortTag=new
  } = req.query;

  const attributeConvert = attribute?.map((item) => {
    const [key, value] = item.split("-");
    return { key, value };
  });

  let productList = products.filter((product) => {
    const nameWithoutAccent = removeAccents(product.name?.toLowerCase());
    const keywords = removeAccents(productName?.toLowerCase()).split(" ");

    const isProductName = productName
      ? keywords.every((keyword) => nameWithoutAccent.includes(keyword))
      : true;

    const isCategoryParent = slugParent
      ? product.slugCategoryParent === slugParent
      : true;

    const isCategoryChildren = slugChildren
      ? slugChildren.includes(product.slugCategoryChildren) ||
        slugChildren.includes(product.slugCategoryParent)
      : true;

    const priceProduct =
      product.price - (product.price * product.discount) / 100;
    const isPriceMin = priceMin ? priceProduct >= Number(priceMin) : true;
    const isPriceMax = priceMax ? priceProduct <= Number(priceMax) : true;

    const isAttribute = attribute
      ? attributeConvert.some((item) => {
          if (Array.isArray(product[item.key])) {
            return product[item.key]?.includes(item.value);
          } else if (typeof product[item.key] === "object") {
            return product[item.key].value === item.value;
          } else {
            return product[item.key] === item.value;
          }
        })
      : true;

    const isSortTag =
      sortTag && sortTag !== "priceAsc" && sortTag !== "priceDesc"
        ? product.tags.includes(sortTag)
        : true;

    return (
      isProductName &&
      isCategoryParent &&
      isCategoryChildren &&
      isPriceMin &&
      isPriceMax &&
      isAttribute &&
      isSortTag
    );
  });

  let sortedProducts = [...productList];

  if (sortTag === "priceAsc") {
    sortedProducts.sort((a, b) => {
      const priceA = a.price - (a.price * a.discount) / 100;
      const priceB = b.price - (b.price * b.discount) / 100;
      return priceA - priceB;
    });
  } else if (sortTag === "priceDesc") {
    sortedProducts.sort((a, b) => {
      const priceA = a.price - (a.price * a.discount) / 100;
      const priceB = b.price - (b.price * b.discount) / 100;
      return priceB - priceA;
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      productList: sortedProducts,
    },
  });
};

exports.getDetail = async (req, res) => {
  const productsData = await fileManager.readFile(FILE_PRODUCTS);
  const products = productsData && productsData.products;
  const { detail } = req.query;
  const objDetail = products.find((product) => product.slug === detail);

  res.status(200).json({
    status: "success",
    objDetail,
  });
};

exports.getAll = async (req, res) => {
  const productsData = await fileManager.readFile(FILE_PRODUCTS);
  const products = productsData.products;
  res.status(200).json({
    status: "success",
    products,
  });
};
