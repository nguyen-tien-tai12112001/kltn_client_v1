import { Button, Modal, Row, Col, Card, Tag } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CANCELED, DONE, PENDING, CONFIRMED } from '../../../../constants/bill';
import { formatNumber } from '../../../../utils';
import OrderItem from '../OrderItem';
import moment from 'moment';
import './style.scss';

const BillItem = ({
  data,
  onHandleCancel,
  notification,
  onClick,
  onHandleRestore,
}) => {
  const {
    order_items,
    _id,
    address,
    order_status,
    payment_type,
    service_total,
    service_type,
    confirmDate,
    doneDate,
    cancelDate,
    createdAt,
  } = data;

  const [visible, setVisible] = useState(false);
  const { userInfo } = useSelector((state) => state.common);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };
  const currency = (money) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(money);
  };

  const totalAmount = useMemo(() => {
    const total = order_items?.reduce((prev, cur) => {
      return prev + cur.quantity * cur.item_price;
    }, 0);

    return total;
  }, [data]);

  return (
    <div className="bill-item" onClick={onClick}>
      {!notification && (
        <div className="bill-item__status">
          <span>
            {data.order_status === DONE ? (
              <Tag color="#87d068">Đã giao</Tag>
            ) : data.order_status === PENDING ? (
              <Tag color="cyan">Đang xử lý</Tag>
            ) : data.order_status === CANCELED ? (
              <Tag color="red">Đã hủy</Tag>
            ) : (
              <Tag color="#2db7f5">Đang giao hàng</Tag>
            )}
          </span>
          <div className="bill-item__header">
            {data.order_status === PENDING && (
              <div className="bill-item__canceled">
                <Button type="primary" danger ghost onClick={onHandleCancel}>
                  Hủy đơn
                </Button>
              </div>
            )}
            {data.order_status === CANCELED && (
              <div className="bill-item__canceled">
                <Button type="primary" danger ghost onClick={onHandleRestore}>
                  Khôi phục đơn
                </Button>
              </div>
            )}
            <div>
              <Button type="primary" onClick={showModal}>
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="bill-item__order-list">
        {data.order_items?.map((item) => (
          <OrderItem key={item._id} data={item} />
        ))}
      </div>
      <div className="bill-item__footer">
        <div className="footer__total-price">
          Phí vận chuyển:{' '}
          <span className="total-price">{currency(service_total)}</span>
        </div>
        <div className="footer__total-price">
          Tổng tiền:{' '}
          <span className="total-price">
            {currency(totalAmount + service_total)}
          </span>
        </div>

        <Modal
          title="Chi tiết đơn hàng"
          visible={visible}
          onOk={hideModal}
          onCancel={hideModal}
          okText="OK"
          width={1000}
          cancelText="Cancel"
        >
          <div className="list-cusomer-order">
            <div className="heading">
              {' '}
              Chi tiết đơn hàng {_id} -{' '}
              <span>
                {order_status === PENDING
                  ? 'Đang chờ xác nhận'
                  : order_status === 'CONFIRMED'
                  ? 'Đang giao hàng'
                  : order_status === DONE
                  ? 'Đã giao thành công'
                  : 'Đã hủy'}
              </span>
            </div>
            {/* <Grid container spacing={3}> */}
            <Row>
              <Col span={24}>
                <div className="Nbknf">
                  <div className="card-body">
                    <div className="steps">
                      <div className="step completed">
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <i className="pe-7s-cart" />
                          </div>
                        </div>
                        <h4 className="step-title">Đơn hàng đã đặt</h4>
                        <span className="step-date">
                          {createdAt
                            ? moment(createdAt).format('MM-DD-YYYY - HH:mm')
                            : ''}
                        </span>
                      </div>
                      {cancelDate && (
                        <div
                          className={`step ${
                            order_status === CANCELED || cancelDate
                              ? 'canceled'
                              : ''
                          }`}
                        >
                          <div className="step-icon-wrap">
                            <div className="step-icon">
                              <i className="pe-7s-junk" />
                            </div>
                          </div>
                          <h4 className="step-title">Đã hủy</h4>
                          <span className="step-date">
                            {cancelDate
                              ? moment(cancelDate).format('MM-DD-YYYY - HH:mm')
                              : ''}
                          </span>
                        </div>
                      )}
                      <div
                        className={`step ${
                          order_status === CONFIRMED || doneDate
                            ? 'completed'
                            : ''
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <i className="pe-7s-check" />
                          </div>
                        </div>
                        <h4 className="step-title">Đã xác nhận thông tin</h4>
                        <span className="step-date">
                          {confirmDate
                            ? moment(confirmDate).format('MM-DD-YYYY - HH:mm')
                            : ''}
                        </span>
                      </div>
                      {/* <div
                        className={`
                step 
                
                
                }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <i className="pe-7s-car" />
                          </div>
                        </div>
                        <h4 className="step-title">Đang chuẩn bị hàng</h4>
                        {/* <span>{prepareDate ? prepareDate : ''}</span> 
                        <span>{'1/2/2/2/'}</span>
                      </div> */}
                      <div
                        className={`step ${
                          order_status === CONFIRMED || doneDate
                            ? 'completed'
                            : ''
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <i className="pe-7s-car" />
                          </div>
                        </div>
                        <h4 className="step-title">Đã giao cho ĐVVC</h4>
                        <span className="step-date">
                          {confirmDate
                            ? moment(confirmDate).format('MM-DD-YYYY - HH:mm')
                            : ''}
                        </span>
                      </div>
                      <div
                        className={`step ${
                          order_status === DONE ? 'completed' : ''
                        }`}
                      >
                        <div className="step-icon-wrap">
                          <div className="step-icon">
                            <i className="pe-7s-star" />
                          </div>
                        </div>
                        <h4 className="step-title">Thành công</h4>
                        <span className="step-date">
                          {doneDate
                            ? moment(doneDate).format('MM-DD-YYYY - HH:mm')
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="cRRvpz">
                  <div className="gQjSfs">
                    {/* <div className="title">Địa chỉ người nhận</div> */}
                    <Card
                      title="Thông tin người nhận"
                      style={{
                        width: 300,
                        boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
                      }}
                    >
                      <div className="content">
                        <p className="name">
                          {userInfo?.first_name + userInfo?.last_name}
                        </p>
                        <p className="address">
                          <span>Địa chỉ: </span>
                          {address?.street +
                            ',' +
                            address?.ward.name +
                            ', ' +
                            address?.district.name +
                            ', ' +
                            address?.province.name}
                        </p>
                        <p className="phone">
                          <span>Điện thoại: </span>
                          {userInfo.phone}
                        </p>
                      </div>
                    </Card>
                  </div>
                  <div className="gQjSfs">
                    {/* <div className="title">Hình thức giao hàng</div> */}
                    <Card
                      title="Hình thức giao hàng"
                      style={{
                        width: 317,
                        boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
                      }}
                    >
                      <div className="content">
                        <p>
                          Thời gian giao dự tính:{' '}
                          {moment(createdAt).add(3, 'days').format('L')}
                        </p>
                        <p>
                          Được giao bởi:{' '}
                          {service_type === 'GHTK'
                            ? 'Giao hàng tiết kiệm'
                            : 'Giao hàng nhanh'}
                        </p>

                        <p>Phí vận chuyển: {currency(service_total)}</p>
                      </div>
                    </Card>
                  </div>
                  <div className="gQjSfs">
                    {/* <div className="title">Hình thức thanh toán</div> */}
                    <Card
                      title="Hình thức thanh toán"
                      style={{
                        width: 300,
                        boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
                      }}
                    >
                      <div className="content">
                        <p className="">
                          {payment_type === 'COD' ? (
                            <Tag color="magenta">Thanh toán khi nhận hàng</Tag>
                          ) : payment_type === 'VNPAY' ? (
                            <Tag color="#f50">Đã thanh toán qua VnPay</Tag>
                          ) : payment_type === 'MOMO' ? (
                            <Tag color="purple">Đã thanh toán qua Momo</Tag>
                          ) : payment_type === 'ZALOPAY' ? (
                            <Tag color="geekblue">
                              Đã thanh toán qua ZaLoPay
                            </Tag>
                          ) : (
                            <Tag color="cyan">Đã thanh toán qua PayPal</Tag>
                          )}
                        </p>
                        {/* <p className="">{orderInfo.status_payment_name}</p> */}
                      </div>
                    </Card>
                  </div>
                </div>
              </Col>

              <Col span={24}>
                <table className="Nbknf">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.order_items.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="product-item">
                              <img
                                src={item?.product.thumbnail_url}
                                alt="Sản phẩm"
                              />
                              <div className="product-info">
                                <Link
                                  className="product-name"
                                  to={`/products/${item?.product?.slug}`}
                                >
                                  {item?.product.name?.slice(0, 40)}...
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="price">
                            {currency(item?.item_price)}
                          </td>
                          <td className="quantity">{item.quantity}</td>
                          <td className="raw-total">
                            {currency(item.item_price * item.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4}>
                        <span>Tạm tính</span>
                      </td>
                      <td>
                        {currency(
                          order_items.reduce((acc, item) => {
                            return acc + item.item_price * item.quantity;
                          }, 0)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <span>Phí vận chuyển</span>
                      </td>
                      <td>{currency(service_total)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <span>Tổng cộng</span>
                      </td>
                      <td>
                        <span className="sum">
                          {currency(
                            order_items.reduce((acc, item) => {
                              return acc + item.item_price * item.quantity;
                            }, 0) + service_total
                          )}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BillItem;
