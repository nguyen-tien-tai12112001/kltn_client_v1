import { CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Col,
  Modal,
  notification,
  Row,
  Tag,
  Tooltip,
} from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CART_API from '../../api/cart';
import ORDER_API from '../../api/order';
import LoadingSection from '../../components/LoadingSection';
import {
  COD,
  GHTK,
  PAYPAL,
  STATUS_FAIL,
  URL_CLIENT_DEPLOYMENT,
} from '../../constants/api';
import { cartActions } from '../../store/cart';
import { formatNumber, getSalePrice } from '../../utils';
import OrderItem from './components/OrderItem';
import './style.scss';

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};
const embed_data = { redirecturl: `${URL_CLIENT_DEPLOYMENT}/success` };
// const embed_data = { redirecturl: 'http://localhost:3000/success' };

const items = [{}];
const transID = Math.floor(Math.random() * 1000000);

const serviceFee = [
  {
    _id: Math.random().toString(16),
    total: 30000,
    short_name: 'Giao hàng tiết kiếm',
    service_type: 'GHTK',
  },
  {
    _id: Math.random().toString(16),
    total: 50000,
    short_name: 'Giao hàng nhanh',
    service_type: 'GHN',
  },
  // { _id:Math.random().toString(16),
  //   total:3000,
  //   short_name:"Giao hàng bằng máy bay"
  // },
];

const payMethods = [
  {
    id: 1,
    type: COD,
    name: 'Thanh toán tiền mặt khi nhận hàng',
  },
  {
    id: 2,
    type: 'VNPAY',
    name: 'Thanh toán bằng ví VnPay',
  },
  {
    id: 3,
    type: 'MOMO',
    name: 'Thanh toán ví MoMo',
  },
  {
    id: 4,
    type: 'ZALOPAY',
    name: 'Thanh toán bằng ví ZaloPay',
  },
  {
    id: 5,
    type: PAYPAL,
    name: 'Thanh toán bằng PayPal',
  },
];

const icon_bank = [
  'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg',
  'https://salt.tikicdn.com/ts/upload/76/80/08/62e0faf2af2869ba93da5f79a9dc4c4b.png',
  'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-momo.svg',
  'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-zalo-pay.svg',
  'https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png',
];

const CheckoutPage = () => {
  const location = useLocation();

  const tempOrderItems = localStorage.getItem('temp_order');
  const tempAddress = localStorage.getItem('temp_address');

  const { userInfo, socket } = useSelector((state) => state.common);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();

  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState();
  const [paymentType, setPaymentType] = useState(COD);

  const [serviceType, setServiceType] = useState(GHTK);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [active, setActive] = useState(null);
  const query = location.search;

  useEffect(() => {
    try {
      const parsedData = JSON.parse(tempOrderItems);
      if (parsedData) setOrderItems(parsedData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [tempOrderItems]);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(tempAddress);
      setAddress(parsedData);
    } catch (error) {
      console.log(error);
    }
  }, [tempAddress]);
  useEffect(() => {
    // socket.emit('join_notification', userInfo?._id);
    // //setup response
    // socket.on('newMessage', (message) => {
    // });
    // disconnect ||cleanup the effect
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, []);
  const totalAmount = useMemo(() => {
    try {
      const total = orderItems.reduce((prev, cur) => {
        return (
          prev +
          cur.quantity *
            getSalePrice(cur.product.price, cur.product.sale_percent)
        );
      }, 0);

      return total;
    } catch (error) {
      return 0;
    }
  }, [orderItems]);

  const totalOriginAmount = useMemo(() => {
    try {
      const total = orderItems.reduce((prev, cur) => {
        return prev + cur.quantity * cur.product.price;
      }, 0);

      return total;
    } catch (error) {
      return 0;
    }
  }, [orderItems]);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const numberWithCommas = (num) =>
    num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 0;

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSetFeeService = (fee, index) => {
    // setFeeServince(fee.total);
    // setServiceTypeId(fee.service_type_id);
    setServiceType(fee.service_type);
    setActive(index);
  };
  useEffect(() => {
    if (serviceFee) {
      if (serviceFee.length) {
        // setFeeServince(serviceFee[0].total);
        // setServiceTypeId(serviceFee[0].service_type_id)
        setActive(0);
      }
    }
  }, [serviceFee]);
  const handleSubmit = async () => {
    const addressPayload = {
      province: address.province,
      district: address.district,
      ward: address.ward,
      street: address.street,
    };

    const service_total = serviceFee.find(
      (item) => item.service_type === serviceType
    ).total;

    const data = {
      payment_type: paymentType,
      user: userInfo._id,
      address: addressPayload,
      service_type: serviceType,
      service_total: service_total,
      total_price: totalAmount,
    };

    localStorage.setItem(
      'dataOrder',
      JSON.stringify({ addressPayload, data, orderItems })
    );

    if (!userInfo.phone || !userInfo.first_name || !userInfo.last_name) {
      return notification.error({
        placement: 'topRight',
        message: 'Đã xảy ra lỗi!!',
        description: 'Vui lòng điền đầy đủ thông tin trước khi đặt hàng!!!',
        duration: 3,
      });
    }
    if (paymentType === COD) {
      try {
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
          item_price: getSalePrice(
            item.product.price,
            item.product.sale_percent
          ),
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

        notification.success({
          placement: 'topRight',
          message: 'Successfully',
          description: response.message,
          duration: 3,
        });

        // history.push('/success');

        setTimeout(() => {
          history.push('/success');
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    } else if (paymentType === 'ZALOPAY') {
      try {
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
          item_price: getSalePrice(
            item.product.price,
            item.product.sale_percent
          ),
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

        const order = {
          app_id: config.app_id,
          app_trans_id: `${moment().format('YYMMDD')}_${response.data._id}`,
          app_user: userInfo.first_name + userInfo.last_name,
          app_time: Date.now(), // miliseconds
          item: JSON.stringify(items),
          embed_data: JSON.stringify(embed_data),
          amount: totalAmount,
          description: `TAKA SHOP - Payment for the order #${response.data._id}`,
          bank_code: '',
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const hmacinput =
          config.app_id +
          '|' +
          order.app_trans_id +
          '|' +
          order.app_user +
          '|' +
          order.amount +
          '|' +
          order.app_time +
          '|' +
          order.embed_data +
          '|' +
          order.item;

        order.mac = CryptoJS.HmacSHA256(hmacinput, config.key1).toString();

        axios
          .post(config.endpoint, null, { params: order })
          .then((res) => {
            if (res.data.return_code === 1) {
              window.location.href = res.data.order_url;
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    } else if (paymentType === 'VNPAY') {
      try {
        const res = await ORDER_API.paymentByVnPay({
          amount: totalAmount + service_total,
        });
        if (res.code === '00') {
          window.location.href = res.data;
        } else {
          return notification.error({
            placement: 'topRight',
            message: 'Error!',
            description: 'Lỗi hệ thống!!!',
            duration: 3,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else if (paymentType === PAYPAL) {
      try {
        const items = orderItems.map((item) => ({
          name: item?.products?.name.slice(0, 30),
          sku: item?.products?.name.slice(0, 30),
          price:
            getSalePrice(item.product.price, item.product.sale_percent) / 25000,
          currency: 'USD',
          quantity: item.quantity,
        }));
        const { message, status } = await ORDER_API.paymentByPayPal({
          amount: totalAmount / 25000,
          items,
        });

        if (status === 'success') {
          for (let i = 0; i < message?.links.length; i++) {
            if (message.links[i].rel === 'approval_url') {
              window.location.href = message.links[i].href;
            }
          }
        } else {
          return notification.error({
            placement: 'topRight',
            message: 'Error!',
            description: 'Lỗi hệ thống!!!',
            duration: 3,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else if (paymentType === 'MOMO') {
      try {
        const response = await ORDER_API.createOrder(data);
        if (response.status === STATUS_FAIL)
          return notification.error({
            placement: 'topRight',
            message: 'Error!',
            description: response.message,
            duration: 3,
          });
        const dt = await ORDER_API.paymentByMoMo({
          total_price: totalAmount + service_total,
          _id: response.data._id,
        });
        // window.location.href = dt.payUrl;
        const orderItemsPayload = orderItems.map((item) => ({
          order_id: response.data._id,
          product: item.product._id,
          item_price: getSalePrice(
            item.product.price,
            item.product.sale_percent
          ),
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
        window.location.href = dt.payUrl;
      } catch (error) {
        console.log(error);
      }
    } else {
      return notification.error({
        placement: 'topRight',
        message: 'Error!',
        description: 'Lỗi hệ thống!!!',
        duration: 3,
      });
    }
  };

  return (
    <div id="checkout">
      <div className="container">
        <div className="checkout__wrap">
          <div className="checkout__header">
            <div className="checkout__header__wrap">
              <Link to="/" className="checkout__header__navigation">
                <img src="/svg/arrow-prev-cart.svg" alt="navigation" />
              </Link>
              <div className="checkout__header__title">
                Thanh Toán <span>({orderItems?.length})</span>
              </div>
            </div>
          </div>
          <div className="bread__crumb-container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <HomeOutlined />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Thanh Toán ({' ' + orderItems?.length})</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="checkout__body checkout__body__response">
            <h3>
              <strong>1. Chi tiết đơn hàng</strong>
            </h3>
            <Row
              gutter={[
                { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 },
                { xl: 12, lg: 12, md: 12, sm: 12, xs: 12 },
              ]}
              className="body_response__row"
            >
              {loading && <LoadingSection />}
              {!loading && (
                <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                  <div className="order__items-container">
                    <ul className="order__items-list">
                      {orderItems?.map((item) => (
                        <li key={item._id} className="order__items-item">
                          <OrderItem data={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="service__methods-wrapper">
                    <h3>
                      <strong>
                        2. Phương thức vận chuyển:
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          {serviceType === 'GHTK'
                            ? 'Giao hàng tiết kiệm'
                            : 'Giao hàng nhanh'}
                        </Tag>
                      </strong>
                    </h3>
                    <Button
                      type="primary"
                      disabled={serviceFee && serviceFee.length === 0}
                      onClick={showModal}
                    >
                      Thay Đổi
                    </Button>
                    <Modal
                      title="Đơn vị vận chuyển"
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      <div class="cards">
                        {serviceFee &&
                          serviceFee.map((item, index) => {
                            if (item) {
                              return (
                                <Tooltip
                                  title=""
                                  color="#2db7f5"
                                  className="card"
                                  key={index}
                                >
                                  <div
                                    class="card card-1"
                                    onClick={() =>
                                      handleSetFeeService(item, index)
                                    }
                                  >
                                    {active === index ? (
                                      <div class="card__icon">
                                        <i class="fas fa-check"></i>
                                      </div>
                                    ) : (
                                      ''
                                    )}

                                    <h2 class="card__title">
                                      Tổng chi phí:
                                      <p className="payment__price">
                                        {numberWithCommas(item.total)}₫
                                      </p>
                                    </h2>
                                    <p class="card__apply">
                                      <p class="card__link">
                                        Phương thức vận chuyển:{' '}
                                        {item.short_name}{' '}
                                      </p>
                                    </p>
                                  </div>
                                </Tooltip>
                              );
                            }
                          })}
                      </div>
                    </Modal>
                  </div>

                  <div className="payment__methods-wrapper">
                    <h3>
                      <strong>3. Phương thức thanh toán</strong>
                    </h3>
                    <div className="method-container">
                      {/* <div
                        className={`method method--paypal ${
                          paymentType === PAYPAL && 'selected'
                        }`}
                      > */}
                      {/* <VNPay></VNPay>
                        <PaypalPayment 
                         onSuccess={() => {
                          setPaymentType(PAYPAL);
                           handleSubmit();
                           }}
                          handleSubmit={handleSubmit}
                         /> */}
                      <ul className="list">
                        {payMethods.map((item, index) => {
                          return (
                            <li className="dWHFNX" key={index}>
                              <label className="HafWE">
                                <input
                                  type="radio"
                                  readOnly
                                  name="payment-methods"
                                  onChange={(e) => setPaymentType(item.type)}
                                  value={item.type}
                                  defaultChecked={item?.type === paymentType}
                                />
                                <span className="radio-fake" />
                                <span className="label">
                                  <div className="fbjKoD">
                                    <img
                                      className="method-icon"
                                      width="32"
                                      src={icon_bank[index]}
                                      alt=""
                                    />
                                    <div className="method-content">
                                      <div className="method-content__name">
                                        <span>{item.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  {/* </div> */}
                </Col>
              )}
              <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                <div className="cart_total__prices">
                  <div
                    className="cart_total__prices__wrap"
                    style={{
                      border: '1px solid var(--my-border-color)',
                    }}
                  >
                    <Row
                      gutter={[0, { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 }]}
                    >
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className="ship_address">
                          <div className="ship_address__wrap">
                            <div className="heading">
                              <div className="text">
                                <strong>Thông tin đặt hàng</strong>
                              </div>
                              {/* <Link className="change_address" to="#">
                                Thay đổi
                              </Link> */}
                            </div>
                            <div className="title">
                              <div className="icon">
                                <img
                                  src="/svg/address-cart.svg"
                                  alt="address"
                                />
                              </div>
                              <div className="name">{`${userInfo.last_name} ${userInfo.first_name}`}</div>
                              <div className="phone">{userInfo.phone}</div>
                            </div>
                            {address && (
                              <div className="address">{`${address.street}, P.${address.ward.name}, Q.${address.district.name}, ${address.province.name}`}</div>
                            )}
                          </div>
                          <Link to="#" className="ship_address__navigation">
                            <img
                              src="/svg/arrow-next-cart.svg"
                              alt="navigation"
                            />
                          </Link>
                        </div>
                      </Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}></Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        <div className="cart_prices">
                          <div className="cart_prices__wrap">
                            <ul className="price_list">
                              <li className="price_item">
                                <span className="price_item__text">
                                  Tạm tính
                                </span>
                                <span className="price_item__value">
                                  {formatNumber(totalOriginAmount)}₫
                                </span>
                              </li>
                              <li className="price_item">
                                <span className="price_item__text">
                                  Giảm giá
                                </span>
                                <span
                                  style={{ color: 'var(--my-red)' }}
                                  className="price_item__value"
                                >
                                  {formatNumber(
                                    totalAmount - totalOriginAmount
                                  )}
                                  đ
                                </span>
                              </li>
                              <li className="price_item">
                                <span className="price_item__text">
                                  Phí vận chuyển
                                </span>
                                <span className="price_item__value">
                                  {formatNumber(
                                    serviceFee.find(
                                      (item) =>
                                        item.service_type === serviceType
                                    ).total
                                  )}
                                  ₫
                                </span>
                              </li>
                            </ul>
                            <div className="prices_total">
                              <div className="prices_total__text">
                                Tổng cộng
                              </div>
                              <div className="prices_total__content">
                                <div className="final">
                                  {formatNumber(
                                    totalAmount +
                                      serviceFee.find(
                                        (item) =>
                                          item.service_type === serviceType
                                      ).total
                                  )}
                                  ₫
                                </div>
                                <div className="note">
                                  (Đã bao gồm VAT nếu có)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        <div className="cart_submit">
                          <button
                            onClick={handleSubmit}
                            className="cart_submit__btn"
                          >
                            Đặt Hàng ({orderItems.length})
                          </button>
                        </div>
                        <Button
                          // icon={<RollbackOutlined />}
                          type="primary"
                          block
                          // href="/cart"
                          size="large"
                        >
                          <Link to="/cart" className="back-to-cart">
                            Quay lại
                          </Link>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="checkout__footer">
            <div className="checkout__footer__wrap">
              <div className="footer_prices">
                <div className="footer_prices__wrap ">
                  <div className="footer_prices__left">
                    <div className="left_title">Tổng cộng</div>
                    <div className="left_text">Vui lòng chọn sản phẩm</div>
                  </div>
                  <div className="footer_prices__right">
                    <div onClick={handleSubmit} className="right_button">
                      Đặt hàng ({orderItems.length})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
