import {
  BellOutlined,
  HomeOutlined,
  UserOutlined,
  WalletOutlined,
  DollarCircleOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Col, Menu, Row, Badge } from 'antd';
import { useSelector } from 'react-redux';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Account from './components/Account';
import Bank from './components/Bank';
import Bill from './components/Bill';
import Notification from './components/Notification';
import Wheel from './components/Wheel';
import './style.scss';

const ProfilePage = () => {
  const { url } = useRouteMatch();
  const { userInfo } = useSelector((state) => state.common);
  const { notifications } = useSelector((state) => state.notifications);

  const { pathname } = useLocation();
  const currentKeys = pathname.split('/').at(-1);

  return (
    <div id="profile">
      <div className="container">
        <div className="profile-container">
          <div className="bread__crumb-container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <HomeOutlined />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Profile</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Account</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="profile-content">
            <Row>
              <Col xxl={4} xl={4} lg={4} md={0} sm={0} xs={0}>
                <div className="sidebar__menu-wrapper">
                  <div className="sidebar__heading">
                    <div className="sidebar__heading-avatar">
                      <img src="https://i.pravatar.cc/45" alt="avatar" />
                    </div>
                    <div className="sidebar__heading-info">
                      <p>Tài khoản của</p>
                      <p className="username">{`${userInfo.last_name} ${userInfo.first_name}`}</p>
                    </div>
                  </div>
                  <Menu
                    defaultSelectedKeys={[currentKeys]}
                    selectedKeys={[currentKeys]}
                  >
                    <Menu.Item key="edit" icon={<UserOutlined />}>
                      <Link to={`${url}/edit`}>Thông tin tài khoản</Link>
                    </Menu.Item>
                    <Menu.Item key="notification" icon={<BellOutlined />}>
                      <Link to={`${url}/notification`}>
                        Thông báo của tôi
                        <Badge
                          count={
                            notifications.filter((item) => item.seen === false)
                              .length
                          }
                        />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="bill" icon={<WalletOutlined />}>
                      <Link to={`${url}/bill`}>Quản lý đơn hàng</Link>
                    </Menu.Item>
                    <Menu.Item key="bank" icon={<BankOutlined />}>
                      <Link to={`${url}/bank`}>Liên kết ngân hàng</Link>
                    </Menu.Item>
                    <Menu.Item key="wheel" icon={<DollarCircleOutlined />}>
                      <Link to={`${url}/wheel`}>Vòng quay may mắn</Link>
                    </Menu.Item>
                  </Menu>
                </div>
              </Col>
              <Col xxl={20} xl={20} lg={20} md={24} sm={24} xs={24}>
                <div className="content-wrapper">
                  <div className="content__heading">
                    <p>
                      {currentKeys === 'bill'
                        ? 'Thông tin đơn hàng'
                        : currentKeys === 'edit'
                        ? 'Thông tin tài khoản'
                        : currentKeys === 'notification'
                        ? 'Thông báo của tôi'
                        : currentKeys === 'wheel'
                        ? 'Vòng quay may mắn'
                        : 'Liên kết ngân hàng'}
                    </p>
                  </div>
                  <Switch>
                    <div
                      className="main-content-wrapper"
                      style={{
                        height: 'auto',
                        border: '1px solid rgb(240 240 240)',
                        boxShadow: '0px 0px 5px 2px #e6e6e6',
                        padding: '16px',
                        background: '#fff',
                      }}
                    >
                      <Route exact path={`${url}/edit`}>
                        <Account />
                      </Route>
                      <Route exact path={`${url}/bill`}>
                        <Bill />
                      </Route>
                      <Route exact path={`${url}/notification`}>
                        <Notification />
                      </Route>
                      <Route exact path={`${url}/bank`}>
                        <Bank />
                      </Route>
                      <Route exact path={`${url}/wheel`}>
                        <Wheel />
                      </Route>
                    </div>
                  </Switch>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
