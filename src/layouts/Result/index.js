import { notification } from 'antd';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CART_API from '../../api/cart';
import ORDER_API from '../../api/order';
import { STATUS_FAIL } from '../../constants/api';
import { cartActions } from '../../store/cart';
import { getSalePrice, runFireworks } from '../../utils';
import './styles.scss';
const ResultPage = ({ status, title, subTitle }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const query = location.search;
  useEffect(() => {
    runFireworks();
  }, []);

  useEffect(() => {
    const { addressPayload, data, orderItems } = JSON.parse(
      localStorage.getItem('dataOrder')
    );

    const pasred = queryString.parse(query);
    const handleSuccess = async () => {
      const response = await ORDER_API.createOrder(data);
      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: 'topRight',
          message: 'Error!',
          description: response.message,
          duration: 3,
        });

      const orderItemsPayload = orderItems.map((item) => ({
        order_id: response.data._id,
        product: item.product._id,
        item_price: getSalePrice(item.product.price, item.product.sale_percent),
        quantity: item.quantity,
      }));

      const revovedCartItemIds = orderItems.map((item) => item._id);

      const orderItemsResponse = await ORDER_API.createOrderItems({
        order_items: orderItemsPayload,
      });

      const cartRemoveResponse = await CART_API.removeCartItems({
        _ids: revovedCartItemIds,
      });

      if (
        orderItemsResponse.status === STATUS_FAIL ||
        cartRemoveResponse.status === STATUS_FAIL
      ) {
        localStorage.removeItem('temp_order');
        localStorage.removeItem('temp_address');
      }

      const newCartItems = cartItems.filter((item) => {
        let index = revovedCartItemIds.findIndex((id) => id === item._id);
        return index === -1;
      });

      dispatch(cartActions.loadCart(newCartItems));
    };

    const handlePaypal = async () => {
      const { message } = await ORDER_API.getReturnUrlPayPal(query);

      if (message.httpStatusCode === 200) {
        history.replace('/success');
        handleSuccess();
      }
    };

    const handleVnPay = async () => {
      const response = await ORDER_API.paymentByVnPayReturn(query);
      if (response.rspCode === '00') {
        history.replace('/success');

        handleSuccess();
      }
    };

    const handle = async () => {
      // Handle Paypal
      if (pasred.PayerID) {
        handlePaypal();
      }
      // Handle Momo payment
      else if (pasred.orderType === 'momo_wallet') {
      }
      // Handle VnPay
      else if (pasred.vnp_TmnCode) {
        handleVnPay();
      }
    };
    handle();
  }, [query]);
  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link to="/">
          <button type="button" width="300px" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;
