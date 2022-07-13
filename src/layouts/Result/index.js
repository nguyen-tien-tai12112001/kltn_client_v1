import { notification, Result } from 'antd';
import { useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ORDER_API from '../../api/order';
import { STATUS_FAIL } from '../../constants/api';
import { getSalePrice } from '../../utils';
import CART_API from '../../api/cart';
import { cartActions } from '../../store/cart';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
const ResultPage = ({ status, title, subTitle }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const query = location.search;
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
    <div id="result">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={<Link to="/">Tiếp tục mua sắm</Link>}
      />
    </div>
  );
};

export default ResultPage;
