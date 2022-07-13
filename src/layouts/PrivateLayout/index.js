import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const Private = (props) => {
  const { userInfo } = useSelector((state) => state.common);

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken || !userInfo._id) return <Redirect to="/" />;

  return <Route {...props} />;
};

export default Private;
