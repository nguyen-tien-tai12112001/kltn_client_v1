import axiosClient from './instances/axiosClient';

const queryNotifications = (userId) => {
  return axiosClient({
    method: 'GET',
    url: `/notifications/${userId}`,
  });
};
const updateNotification = (_id) => {
  return axiosClient({
    method: 'PUT',
    url: `/notifications/${_id}`,
  });
};

const NOTIFICATION_API = {
  queryNotifications,
  updateNotification,
};

export default NOTIFICATION_API;
