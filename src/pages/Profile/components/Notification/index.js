import {
  CaretDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProfileFilled,
} from '@ant-design/icons';
import { Collapse, Empty, Tabs, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NOTIFICATION_API from '../../../../api/notification';
import ORDER_API from '../../../../api/order';

import moment from 'moment';
import { STATUS_FAIL, STATUS_OK } from '../../../../constants/api';
import { notificationActions } from '../../../../store/notification';
import BillItem from '../BillItem';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const Notification = () => {
  const dispatch = useDispatch();

  const { userInfo, socket } = useSelector((state) => state.common);
  const { notifications } = useSelector((state) => state.notifications);

  const notificationsSystem = notifications.filter(
    (notification) => notification.type === 'SYSTEM'
  );

  const notificationsOrder = notifications.filter(
    (notification) => notification.type === 'ORDER'
  );

  const [number, setNumber] = useState(1);

  // const countNotification = notifications.filter(
  //   (item) => item.seen === false
  // ).length;

  useEffect(() => {
    socket.on('hi', ({ _id, order_id }) => {
      if (userInfo._id === _id) {
        setNumber((pre) => pre + 1);
      }
    });

    // disconnect ||cleanup the effect
    return () => socket.disconnect();
    // eslint-disable-next-line
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!userInfo._id || userInfo._id === '') return;

        const response = await NOTIFICATION_API.queryNotifications(
          userInfo._id
        );

        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        const notificationsInfo = await Promise.all(
          response?.data
            ?.filter((item) => item.type === 'ORDER')
            .map(
              (item) =>
                new Promise(async (resolve) => {
                  let orderDetail;

                  if (item?.order_id !== '') {
                    const orderResponse = await ORDER_API.getOneOrder(
                      item.order_id
                    );

                    if (orderResponse.status === STATUS_OK)
                      orderDetail = orderResponse.data;
                  }
                  resolve({
                    _id: item._id,
                    text: item.content,
                    seen: item.seen,
                    type: item.type,
                    orderDetail: orderDetail,
                    createdAt: item.createdAt,
                  });
                })
            )
        );

        const notificationsSystem = await Promise.all(
          response?.data
            .filter((item) => item.type === 'SYSTEM')
            .map(
              (item) =>
                new Promise(async (resolve) => {
                  resolve({
                    _id: item._id,
                    text: item.content,
                    seen: item.seen,
                    type: item.type,
                    createdAt: item.createdAt,
                  });
                })
            )
        );
        dispatch(
          notificationActions.loadNotification([
            ...notificationsSystem,
            ...notificationsInfo,
          ])
        );
      } catch (error) {}
    };
    fetch();
  }, [userInfo._id, number]);

  const updateNotification = async (_id, seen) => {
    if (seen === false) {
      const response = await NOTIFICATION_API.updateNotification(_id);
      dispatch(notificationActions.updateNotification(response.data));
      setNumber((pre) => pre + 1);
    } else {
      return;
    }
  };

  return (
    <div className="notification">
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <ProfileFilled style={{ fontSize: '35px' }} />
            </span>
          }
          key="ALL"
        >
          {notificationsOrder?.length > 0 ? (
            <Collapse
              expandIcon={({ isActive }) => (
                <Tooltip
                  title="Thông báo hóa đơn"
                  color="#108ee9"
                  key={'#108ee9'}
                >
                  <CaretDownOutlined rotate={isActive ? 0 : -90} />
                </Tooltip>
              )}
            >
              {notificationsOrder
                .filter((item) => item.orderDetail)
                .map((item) => (
                  <Panel
                    header={
                      item.seen === false ? (
                        <span style={{ color: 'red' }}>{item.text}</span>
                      ) : (
                        <span style={{ color: 'green' }}>{item.text}</span>
                      )
                    }
                    key={item._id}
                    extra={
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        {moment(item.createdAt).calendar()}
                      </Tag>
                    }
                  >
                    <BillItem
                      onClick={() => updateNotification(item._id, item.seen)}
                      data={item.orderDetail}
                      notification={true}
                    />
                  </Panel>
                ))}
            </Collapse>
          ) : (
            <Empty />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <ClockCircleOutlined style={{ fontSize: '35px' }} />
            </span>
          }
          key="system"
        >
          {notificationsSystem?.length > 0 ? (
            <Collapse
              expandIcon={({ isActive }) => (
                <Tooltip
                  title="Thông báo sự kiện"
                  color="#108ee9"
                  key={'#108ee9'}
                >
                  <CaretDownOutlined rotate={isActive ? 0 : -90} />
                </Tooltip>
              )}
            >
              {notificationsSystem.map((item) => (
                <Panel
                  showArrow={false}
                  header={item.text}
                  key={item._id}
                  forceRender={true}
                  extra={
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      {moment(item.createdAt).calendar()}
                    </Tag>
                  }
                >
                  {/* <BillItem data={item.orderDetail} notification={true} /> */}
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Notification;
