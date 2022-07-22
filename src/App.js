import { CloseOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import 'antd/dist/antd.min.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import ADDRESS_API from './api/address';
import AUTH_API from './api/auth';
import CART_API from './api/cart';
import CONFIGS_API from './api/config';
import NOTIFICATION_API from './api/notification';
import ORDER_API from './api/order';
import LoginForm from './components/Login';
import { STATUS_FAIL, STATUS_OK } from './constants/api';
import './index.css';
import ActivationEmail from './layouts/ActivationEmail';
import ExpriedEmail from './layouts/ExpriedEmail';
import MainLayout from './layouts/MainLayout';
import Result from './layouts/Result';
import SignLayout from './layouts/SignLayout';
import { cartActions } from './store/cart';
import { commonActions } from './store/common';
import { notificationActions } from './store/notification';
import Success from './pages/Success';

function App() {
  const dispatch = useDispatch();
  const { userInfo, socket, configs, loginForm } = useSelector(
    (state) => state.common
  );

  const notificationSound = new Audio('/sound/notification_sound.wav');
  const { pathname } = useLocation();

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCloseLoginForm = () => {
    dispatch(commonActions.toggleLoginForm(false));
  };
  useEffect(() => {
    socket.on('hi', ({ _id, order_id }) => {
      if (userInfo._id === _id) {
        notificationSound.play();

        return notification.info({
          placement: 'topRight',
          message: 'Notification Create Order!!!',
          description: `Đơn hàng ${order_id} đã được xác nhận`,
          duration: 3,
        });
      }
      // setNumber((pre) => pre + 1);
    });

    // disconnect ||cleanup the effect
    return () => socket.disconnect();
    // eslint-disable-next-line
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    AUTH_API.verify(token)
      .then((response) => {
        if (response.status === STATUS_FAIL) return console.log('Not logged!');

        dispatch(commonActions.setUserInfo(response.data));
        dispatch(commonActions.toggleLogged(true));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!userInfo._id || userInfo._id === '') return;

    CART_API.queryCart(userInfo._id)
      .then((response) => {
        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        dispatch(cartActions.loadCart(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfo]);

  useEffect(() => {
    CONFIGS_API.getConfigs()
      .then((response) => {
        if (response.status === STATUS_OK)
          dispatch(commonActions.setConfigs(response.data));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!userInfo._id) return;

    ADDRESS_API.getAddressesByUser(userInfo._id)
      .then((response) => {
        if (response.status === STATUS_OK)
          dispatch(commonActions.setAddresses(response.data));
        else throw new Error(response.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfo?._id]);

  useEffect(() => {
    scrollTop();
  }, [pathname]);

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
  }, [userInfo._id]);

  return (
    <div className="App">
      {loginForm && (
        <div className="auth__form-wrapper">
          <div className="form-block">
            <button className="close__form-btn" onClick={handleCloseLoginForm}>
              <CloseOutlined style={{ color: 'rgb(78, 78, 78)' }} />
            </button>
            <LoginForm />
          </div>
        </div>
      )}
      {/* {registerForm && (
        <div className="auth__form-wrapper">
          <div className="form-block">
            <button className="close__form-btn" onClick={handleCloseRegisterForm}>
              <CloseOutlined style={{ color: "rgb(78, 78, 78)" }} />
            </button>
            <RegisterForm />
          </div>
        </div>
      )} */}
      {/* <div className="auth__form-wrapper">
        <div className="form-block">
          <RegisterForm />
        </div>
      </div> */}
      <Switch>
        <Route path="/success">
          <Result />
          {/* <Success /> */}
        </Route>
        <Route path="/fail_verify">
          <ExpriedEmail
            status="error"
            title="Email verification failed"
            subTitle={`Please register again to receive a new verification link!!!`}
          />
        </Route>
        <Route path="/activate_email">
          <ActivationEmail
            status="success"
            title="Đăng ký thành công"
            subTitle={`Tài khoản của bạn đang được xác nhận. Cảm ơn bạn đã tin tưởng ${configs?.page_name}.`}
          />
        </Route>
        <Route path="/auth">
          <SignLayout />
        </Route>
        <Route path="/">
          <MainLayout />
        </Route>
        {/* <Route path="*" exact={true}>
          <NotFound />
        </Route> */}
      </Switch>
    </div>
  );
}

export default App;
