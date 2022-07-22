import axiosClient from './instances/axiosClient';

const createOrder = (data) => {
  return axiosClient({
    method: 'POST',
    data,
    url: '/orders',
  });
};

const createOrderItems = (data) => {
  return axiosClient({
    method: 'POST',
    data,
    url: '/order-items',
  });
};

const queryUserOrdersList = (userId) => {
  return axiosClient({
    method: 'GET',
    url: `/orders/user?user=${userId}`,
  });
};

const canceledOrder = (_id) => {
  return axiosClient({
    method: 'PUT',
    url: `/orders/cancel-order/${_id}`,
  });
};
const restoreOrder = (_id) => {
  return axiosClient({
    method: 'PUT',
    url: `/orders/restore-order/${_id}`,
  });
};

const getOneOrder = (_id) => {
  return axiosClient({
    method: 'GET',
    url: `/orders/${_id}`,
  });
};

const paymentByVnPay = (data) => {
  return axiosClient({
    method: 'POST',
    data,
    url: '/orders/create_payment_url',
  });
};

const paymentByVnPayReturn = (query) => {
  return axiosClient({
    method: 'GET',
    url: `/orders/vnpay_return${query}`,
  });
};

const paymentByPayPal = (data) => {
  return axiosClient({
    method: 'POST',
    data,
    url: `/orders/create_payment_paypal`,
  });
};

const getReturnUrlPayPal = (query) => {
  return axiosClient({
    method: 'GET',
    url: `/orders/return_url_paypal${query}`,
  });
};

const paymentByMoMo = (data) => {
  return axiosClient({
    method: 'POST',
    url: `/orders/create_payment_momo`,
    data,
  });
};

const ORDER_API = {
  createOrder,
  createOrderItems,
  queryUserOrdersList,
  canceledOrder,
  getOneOrder,
  paymentByVnPay,
  paymentByVnPayReturn,
  paymentByPayPal,
  getReturnUrlPayPal,
  paymentByMoMo,
  restoreOrder,
};

export default ORDER_API;
