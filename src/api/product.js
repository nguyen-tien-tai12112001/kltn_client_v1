import axiosClient from './instances/axiosClient';

const getProductImages = (productId) => {
  return axiosClient({
    method: 'GET',
    url: `/product-images?product_id=${productId}`,
  });
};

const getOneProduct = (slug) => {
  return axiosClient({
    method: 'GET',
    url: `/products/${slug}`,
  });
};

const queryProducts = (query) => {
  return axiosClient({
    method: 'GET',
    url: `/products${query}`,
  });
};

const queryProductAll = () => {
  return axiosClient({
    method: 'GET',
    url: `/products`,
  });
};

const rate = (data) => {
  return axiosClient({
    method: 'POST',
    url: '/ratings',
    data,
  });
};

const queryRates = (query) => {
  return axiosClient({
    method: 'GET',
    url: `/ratings${query}`,
  });
};

const getIsBought = (userId, productId) => {
  return axiosClient({
    method: 'GET',
    url: `/ratings/bought?user_id=${userId}&product_id=${productId}`,
  });
};

const sentimentAnalyst = (data) => {
  return axiosClient({
    method: 'POST',
    url: `/ratings/sentiment`,
    data,
  });
};
const PRODUCT_API = {
  getOneProduct,
  queryProducts,
  rate,
  sentimentAnalyst,
  queryRates,
  getIsBought,
  getProductImages,
  queryProductAll,
};

export default PRODUCT_API;
