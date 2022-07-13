import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { fetchActivationEmail } from '../../Store/Reducer/authReducer';
import axios from 'axios';
// import { setLoadingAction } from '../../Store/Reducer/loadingReducer';
import AUTH_API from '../../api/auth';
import { STATUS_OK, STATUS_FAIL, ENDPOINT } from '../../constants/api';
import { commonActions, initState } from '../../store/common';
// import { splitFullName } from "../../../utils";
import { Button, Checkbox, Divider, Form, Input, notification } from 'antd';

function ActivationEmail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { activation_token } = useParams();

  // const user = localStorage.getItem('user');
  // const token = localStorage.getItem('token');
  const redirect = (path) => {
    history.push(path);
  };
  useEffect(() => {
    if (activation_token) {
      // dispatch(setLoadingAction(true));
      const fetchActivationEmail = async () => {
        try {
          const res = await axios.post(`${ENDPOINT}/api/v1/auth/activate`, {
            activation_token,
          });

          const userInfoResponse = await AUTH_API.verify(res.data.data.token);

          if (userInfoResponse.status === STATUS_FAIL)
            return notification.error({
              placement: 'bottomLeft',
              message: 'Login failed!',
              description: userInfoResponse.message,
              duration: 3,
            });
          notification.success({
            placement: 'topRight',
            message: 'Login successfully!!!',
            // description: `Please login to Tiki`,
            duration: 3,
          });
          dispatch(commonActions.setUserInfo(userInfoResponse.data));
          dispatch(commonActions.toggleLogged(true));
          localStorage.setItem('access_token', res.data.data.token);
          redirect('/');
        } catch (error) {
          console.log({ msg: error.message });
          redirect('/fail_verify');
          setTimeout(
            () =>
              notification.error({
                placement: 'topRight',
                message: 'Verify failed!!',
                description: `Verification code has expired, please re-register!`,
                duration: 3,
              }),
            1000
          );
          // toast.error(`${error.message} 😓`);
        }
      };
      fetchActivationEmail();
      // dispatch(fetchActivationEmail(activation_token));
    }
  }, []);

  // useEffect(() => {
  //     if (user && token) {
  //         history.push('/');
  //         setTimeout(() => {
  //             dispatch(setLoadingAction(false));
  //         }, 500);
  //     }
  // }, [dispatch, history, user, token]);

  return <div></div>;
}

ActivationEmail.propTypes = {};

export default ActivationEmail;
