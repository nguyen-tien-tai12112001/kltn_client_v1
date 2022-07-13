import axiosClient from './instances/axiosClient';

const getProducts = () => {
  return axiosClient({
    method: 'GET',
    url: `/products?status=true&page=1`,
  });
};

const getAllProducts = () => {
  return axiosClient({
    method: 'GET',
    url: `/products/all`,
  });
};

const getCategories = () => {
  return axiosClient({
    method: 'GET',
    url: `/categories?status=true&page=1&page_size=15`,
  });
};

const getBrands = () => {
  return axiosClient({
    method: 'GET',
    url: `/brands?status=true&page=1&page_size=15`,
  });
};

const COMMON_API = {
  getProducts,
  getCategories,
  getBrands,
  getAllProducts,
};

export default COMMON_API;
