import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AppChat from '../../components/Chat';
import ScrollToTop from '../../components/ScrollToTop';
import routes from '../../routes';
import Private from '../PrivateLayout';
import Footer from './Footer';
import Header from './Header';
import MessengerCustomerChat from 'react-messenger-customer-chat';
const MainLayout = () => {
  const { userInfo } = useSelector((state) => state.common);

  return (
    <div className="main_layout">
      <Header />
      <div className="layout_content__wrap">
        <Switch>
          {routes.map((route) => {
            if (!route.private)
              return <Route key={route.name} exact {...route} />;
            return <Private {...route} key={route.name} />;
          })}
        </Switch>
      </div>
      <ScrollToTop />
      {userInfo && userInfo.role === 2 ? <AppChat /> : ''}
      {userInfo && userInfo.role === 2 ? (
        <MessengerCustomerChat
          pageId="109746535131207"
          appId="2639083176221882"
        />
      ) : (
        ''
      )}
      <Footer />
    </div>
  );
};

export default MainLayout;
