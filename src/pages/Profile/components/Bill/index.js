import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Empty, Modal, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ORDER_API from '../../../../api/order';
import { STATUS_FAIL, STATUS_OK } from '../../../../constants/api';
import { CANCELED, CONFIRMED, DONE, PENDING } from '../../../../constants/bill';
import BillItem from '../BillItem';
import LoadingSection from '../../../../components/LoadingSection';
import './style.scss';
const { confirm } = Modal;

const { TabPane } = Tabs;

const Bill = () => {
  const { userInfo } = useSelector((state) => state.common);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      try {
        if (!userInfo._id || userInfo._id === '') return;

        const response = await ORDER_API.queryUserOrdersList(userInfo._id);
        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        setBills(response.data.reverse());
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [userInfo._id]);

  const pending = useMemo(
    () => bills.filter((item) => item.order_status === PENDING),
    [bills]
  );

  const confirmed = useMemo(
    () => bills.filter((item) => item.order_status === CONFIRMED),
    [bills]
  );

  const done = useMemo(
    () => bills.filter((item) => item.order_status === DONE),
    [bills]
  );

  const canceled = useMemo(
    () => bills.filter((item) => item.order_status === CANCELED),
    [bills]
  );

  const handleCancel = async (_id) => {
    confirm({
      title: 'Hủy Đơn Hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      onOk: async () => {
        try {
          const response = await ORDER_API.canceledOrder(_id);
          if (response.status === STATUS_OK)
            try {
              const response = await ORDER_API.queryUserOrdersList(
                userInfo._id
              );
              if (response.status === STATUS_FAIL)
                return console.log(response.message);

              setBills(response.data.reverse());
            } catch (error) {
              console.log(error.message);
            }
        } catch (error) {
          console.log(error);
        }
      },
      onCancel() {},
    });
  };

  const handleRestore = async (_id) => {
    confirm({
      title: 'Khôi phục đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn khôi phục đơn hàng này?',
      onOk: async () => {
        try {
          const response = await ORDER_API.restoreOrder(_id);

          if (response.status === STATUS_OK)
            try {
              const response = await ORDER_API.queryUserOrdersList(
                userInfo._id
              );
              if (response.status === STATUS_FAIL)
                return console.log(response.message);

              setBills(response.data.reverse());
            } catch (error) {
              console.log(error.message);
            }
        } catch (error) {
          console.log(error);
        }
      },
      onCancel() {},
    });
  };

  return (
    <div className="bill">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả đơn" key="ALL">
          {loading && <LoadingSection />}
          {bills.map((item) => (
            <BillItem
              key={item._id}
              data={item}
              onHandleCancel={() => handleCancel(item._id)}
              onHandleRestore={() => handleRestore(item._id)}
            />
          ))}
          {bills.length === 0 && <Empty />}
        </TabPane>

        <TabPane tab="Đang xử lý" key={PENDING}>
          {loading && <LoadingSection />}
          {pending.map((item) => (
            <BillItem
              onHandleCancel={() => handleCancel(item._id)}
              key={item._id}
              data={item}
            />
          ))}
          {pending.length === 0 && <Empty />}
        </TabPane>
        <TabPane tab="Đang giao hàng" key={CONFIRMED}>
          {loading && <LoadingSection />}
          {confirmed.map((item) => (
            <BillItem key={item._id} data={item} />
          ))}
          {confirmed.length === 0 && <Empty />}
        </TabPane>
        <TabPane tab="Đã giao" key={DONE}>
          {loading && <LoadingSection />}
          {done.map((item) => (
            <BillItem key={item._id} data={item} />
          ))}
          {done.length === 0 && <Empty />}
        </TabPane>
        <TabPane tab="Đã hủy" key={CANCELED}>
          {loading && <LoadingSection />}
          {canceled.map((item) => (
            <BillItem
              key={item._id}
              data={item}
              onHandleRestore={() => handleRestore(item._id)}
            />
          ))}
          {canceled.length === 0 && <Empty />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Bill;
