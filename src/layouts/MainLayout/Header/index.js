import {
  BellFilled,
  DownOutlined,
  LogoutOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row, notification, Badge } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import styled from 'styled-components';
import PRODUCT_API from '../../../api/product';
import firebase from '../../../services/firebase';
import { commonActions } from '../../../store/common';
import io from 'socket.io-client';
import {
  addSearchItemUserApi,
  getSearchItemUserApi,
  searchItemSelector,
} from '../../../store/search';
import './style.scss';

let socket;

// import Search from '../../../components/Search';
// import styled from 'styled-components';
const defaultHistories = [
  { _id: 1, type: 'history', name: 'Bàn' },
  { _id: 2, type: 'history', name: 'Chuột không dây' },
  { _id: 3, type: 'history', name: 'Đèn học' },
  { _id: 4, type: 'history', name: 'Máy tính bảng' },
  { _id: 5, type: 'history', name: 'Điện thoại' },
];
const SearchComponent = styled.div`
  .header__menu__right__item {
    position: relative;
    margin-right: 35px;
  }
  .header__menu__item__search-dropdown-menu-search {
    position: absolute;
    /* height: 50px; */
    height: auto;
    top: 110%;
    right: 29%;
    background: #fff;
    box-shadow: 0px 2px 25px 1px #e6e6e6;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.25s ease-in-out;
    z-index: 1500;
    &.hidden {
      right: -40%;
      width: 500px;
      opacity: 0;
      visibility: hidden;
    }
  }

  .header__menu__item__search-history {
    padding: 15px 30px;
    height: 100px;
    overflow: hidden;
    transition: 0.25s ease-in-out;
  }
  .header__menu__item__search-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 17px;
    color: #6c6c6c;
    width: 466px;
    &:hover {
      background: #f0f8ffab;
    }
  }
  .header__menu__item__search-item-content {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
  }
  p.header__menu__item__search-text {
    margin: 0 20px;
  }
  .header__menu__item__search-category {
    padding: 5px 15px;
  }
  p.header__menu__item__search-category-title {
    font-size: 17px;
  }
  .header__menu__item__search-category-item {
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 20px 3px #dfdfdf;
    }
  }
  .header__menu__item__search-category-item-img {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 5px;
  }
  img {
    width: 45%;
  }
  p.header__menu__item__search-category-item-name {
    font-size: 13px;
    text-align: center;
    padding: 0 20px;
  }
  i.icon-delete {
    padding: 0 15px;
    cursor: pointer;
  }
  .header__menu__item__search-history-close {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header__menu__item__search-category-item {
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
const Header = () => {
  let arrSearchItem = [];

  const searchItem = useSelector(searchItemSelector);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [display, setDisplay] = useState('block');
  const [height, setHeight] = useState(110);
  const [searchAll, setSearchAll] = useState([]);
  const [status, setStatus] = useState(true);

  const insertSearchItemUser = (data) => {
    dispatch(addSearchItemUserApi(data));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', (e) => {
        if (dropdownRef.current) {
          dropdownRef.current.classList.remove('hidden');
        }
      });
    }
    // if (inputRef.current) {
    //   inputRef.current.addEventListener('blur', (e) => {
    //     if (dropdownRef.current) {
    //       dropdownRef.current.classList.add('hidden');
    //     }
    //   });
    // }
    return () => {
      if (inputRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        inputRef.current.removeEventListener('focus', null);
        // inputRef.current.removeEventListener('blur', null);
      }
    };
  }, []);
  useEffect(() => {
    (async function () {
      try {
        const { data } = await PRODUCT_API.queryProductAll();
        setSearchAll(data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        (!e.target.closest('.header__menu__item__search-wrap') &&
          !e.target.closest(
            '.header__menu__item__search-dropdown-menu-search'
          ) &&
          !e.target.closest('.header__menu__item__input-search') &&
          !e.target.closest('.icon-delete')) ||
        e.target.closest('.header__menu__item__search-item-content')
      ) {
        if (dropdownRef.current) {
          dropdownRef.current.classList.add('hidden');
          setHeight(110);
          setStatus(true);
        }
      }
      if (e.target.closest('.header__menu__item__input-search')) {
        dropdownRef.current.classList.remove('hidden');
        setHeight(110);
        // setStatus(true);
      }
    });
    return () => {
      window.removeEventListener('click', null);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        !e.target.closest('.header__menu__item__search-wrap') &&
        !e.target.closest('.header__menu__item__search-dropdown-menu-search')
      ) {
        if (
          searchRef.current &&
          searchRef.current.className ===
            'header__menu__item__search-wrap active'
        ) {
          if (inputRef.current && !inputRef.current.value.length) {
            searchRef.current.classList.remove('active');
          } else {
            searchRef.current.classList.add('active');
          }
        }
      }
    });
  }, []);
  const historiesArr = useRef(
    typeof JSON.parse(localStorage.getItem('history')) === 'array' &&
      JSON.parse(localStorage.getItem('history'))?.length > 0
      ? JSON.parse(localStorage.getItem('history'))
      : defaultHistories
  ).current;

  const history = useHistory();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo, isLogged } = useSelector((state) => state.common);
  const { notifications } = useSelector((state) => state.notifications);

  const [search, setSearch] = useState('');
  const [histories, setHistories] = useState(historiesArr);
  const removeSearchItem = (id) => {
    const newHistory = histories.filter((item) => item._id !== id);
    localStorage.setItem('history', JSON.stringify(newHistory));
    setHistories(newHistory);
  };
  const cartQty = useMemo(() => {
    const qty = cartItems.reduce((prev, cur) => {
      return prev + cur.quantity;
    }, 0);

    return qty;
  }, [cartItems]);
  const handleHeightSearchItem = (items) => {
    const arr_items = items.slice(2);
    return arr_items.length * 50;
  };
  const onCloseMenuSearch = (s) => {
    const height_search = handleHeightSearchItem([...histories, ...searchAll]);
    if (s) {
      setHeight(110 + height_search);
      setStatus(!s);
    } else {
      setHeight(height - height_search);
      setStatus(!s);
    }
  };
  const handleSearchChange = ({ target: { value } }) => {
    dropdownRef.current.classList.remove('hidden');
    setSearch(value);
  };

  const handleSearch = () => {
    const value = search?.trim();

    if (!value) return;
    if (historiesArr?.length > 0) {
      let check = historiesArr.findIndex(
        (data) => data.name.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (check === -1) {
        if (historiesArr.length > 7) historiesArr.shift();

        historiesArr.push({
          _id: Math.random().toString(36).substr(2, 9),
          name: value,
          type: 'history',
        });
      }
    } else {
      // historiesArr = [value];
    }

    localStorage.setItem('history', JSON.stringify(historiesArr));
    setHistories(historiesArr);
    // insertSearchItemUser(search);

    history.push(`/products?search=${value}`);
  };
  const handleSearchByValue = (search) => {
    const value = search?.trim();

    if (!value) return;
    if (historiesArr?.length > 0) {
      let check = historiesArr.findIndex(
        (data) => data.name.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (check === -1) {
        if (historiesArr.length > 7) historiesArr.shift();

        historiesArr.push({
          _id: Math.random().toString(36).substr(2, 9),
          name: value,
          type: 'history',
        });
      }
    } else {
      // historiesArr = [value];
    }

    localStorage.setItem('history', JSON.stringify(historiesArr));
    setHistories(historiesArr.reverse());
    // insertSearchItemUser(search);

    history.push(`/products?search=${value}`);
  };

  const handleLogin = () => {
    dispatch(commonActions.toggleLoginForm(true));
  };

  const handleRegister = () => {
    dispatch(commonActions.toggleRegisterForm(true));
  };

  const handleLogout = () => {
    handleLogin();
    firebase.auth().signOut();
  };

  const handleRedirectCart = () => {
    if (!isLogged) return handleLogin();

    return history.push('/cart');
  };

  const menuAccount = (
    <Menu>
      <Menu.Item key={'notification'}>
        <Link to="/profile/notification">
          <BellFilled
            style={{
              fontSize: 18,
              marginLeft: 2,
              marginRight: 11,
              color: 'var(--my-primary-color',
            }}
          />
          Thông báo của tôi
          <span className="badge_notification">
            {notifications.filter((item) => item.seen === false).length}
          </span>
          {/* {notifications.length > 0 && <Badge count={notifications.length} />} */}
        </Link>
      </Menu.Item>
      <Menu.Item key="bill">
        <Link to="/profile/bill">
          <img
            src="/svg/my-order-header.svg"
            alt="my-order"
            className="my_order"
          />
          Đơn hàng của tôi
        </Link>
      </Menu.Item>
      <Menu.Item key="edit">
        <Link to="/profile/edit">
          <img
            src="/svg/my-account-header.svg"
            alt="my-order"
            className="my_account"
          />
          Tài khoản của tôi
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/" onClick={handleLogout}>
          <LogoutOutlined
            style={{
              marginLeft: 2,
              fontSize: 17,
              color: 'var(--my-red)',
              marginRight: 10,
            }}
          />
          Thoát tài khoản
        </Link>
      </Menu.Item>
    </Menu>
  );
  const loginMenu = (
    <Menu>
      <Menu.Item key={'login'} onClick={handleLogin}>
        <Link to="#">
          <LogoutOutlined
            style={{
              marginLeft: 2,
              fontSize: 17,
              marginRight: 10,
            }}
          />
          Đăng nhập
        </Link>
      </Menu.Item>
      <Menu.Item key={'register'}>
        <Link to="/auth/register">
          <img
            src="/svg/my-account-header.svg"
            alt="my-order"
            className="my_account"
          />
          Đăng ký
        </Link>
      </Menu.Item>
    </Menu>
  );
  const setActiveClass = () => {
    if (search) {
      insertSearchItemUser(search);
    }
    if (searchRef.current) {
      if (searchItem === null) {
        dispatch(getSearchItemUserApi());
      }
      searchRef.current.classList.add('active');
      dropdownRef.current.classList.remove('hidden');
    }
  };
  const handleChangeInputToSearch = (value, e) => {
    if (!e.target.closest('.icon-delete')) {
      setSearch(value);
      // insertSearchItemUser(value);
    }
  };
  const renderUISearch = (arrSearchItem) => {

    return arrSearchItem.length
      ? arrSearchItem.map((item, index) => {
          if (item) {
            return (
              <div
                className="header__menu__item__search-item"
                key={index}
                onClick={(e) => {
                  handleChangeInputToSearch(item.name, e);
                  // handleSearchByValue(item.name.slice(0, 20));
                }}
              >
                <div
                  onClick={() => handleSearchByValue(item.name.slice(0, 20))}
                  style={{ width: '100%' }}
                >
                  <div className="header__menu__item__search-item-content">
                    {item?.type === 'history' ? (
                      <i className="fa fa-history"></i>
                    ) : (
                      <i className="fa fa-search" aria-hidden="true"></i>
                    )}
                    <p className="header__menu__item__search-text">
                      {item.name.length > 20
                        ? item?.name.slice(0, 20)
                        : item.name}
                    </p>
                  </div>
                </div>
                {item?.type === 'history' ? (
                  <i
                    className="fa fa-times icon-delete"
                    onClick={() => removeSearchItem(item._id)}
                  ></i>
                ) : (
                  ''
                )}
              </div>
            );
          }
        })
      : '';
  };
  const heightSearch = () => {
    return height <= 350 ? height : 350;
  };
  const renderUISearchSame = () => {
    if (search) {
      arrSearchItem = [...histories, ...searchAll].filter((text) => {
        return text.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      });
    }
    if (arrSearchItem.length > 0) {
      return renderUISearch(arrSearchItem);
    } else {
      dropdownRef.current.classList.add('hidden');
      return false;
    }
  };

  return (
    <div id="header_main">
      <div className="container">
        <div className="header_main__wrap">
          <div className="header_main__top">
            <div className="header_main__top__wrap">
              <Row gutter={[{ xl: 16, lg: 16, md: 16, sm: 16, xs: 16 }, 16]}>
                <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                  <div className="top_left">
                    <Row
                      gutter={[{ xl: 72, lg: 72, md: 24, sm: 24, xs: 24 }, 0]}
                    >
                      <Col xl={5} lg={5} md={5} sm={5} xs={5}>
                        <div className="logo">
                          <Link className="logo_link" to="/">
                            <img src="/images/logo_taka.png" alt="logo" />
                          </Link>
                        </div>
                      </Col>
                      <Col xl={19} lg={19} md={19} sm={19} xs={19}>
                        <div className="search">
                          <div className="search_wrap">
                            <input
                              className="header__menu__item__input-search"
                              type="text"
                              defaultValue=""
                              onChange={handleSearchChange}
                              ref={inputRef}
                              placeholder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn ..."
                            />
                            <button onClick={handleSearch}>
                              <img
                                src="/images/search-icon.png"
                                alt="icon-search"
                              />
                              Tìm Kiếm
                            </button>
                            <SearchComponent>
                              {search ? (
                                <div
                                  className={`header__menu__item__search-dropdown-menu-search hidden`}
                                  ref={dropdownRef}
                                  id="dropdown"
                                >
                                  <div
                                    className={`header__menu__item__search-history `}
                                    style={{ height: 'auto' }}
                                  >
                                    {renderUISearchSame()}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="header__menu__item__search-dropdown-menu-search hidden"
                                  ref={dropdownRef}
                                >
                                  <div
                                    className="header__menu__item__search-history"
                                    style={{ height: heightSearch() }}
                                  >
                                    {renderUISearch([
                                      ...histories,
                                      ...searchAll,
                                    ])}
                                  </div>
                                  <div className="header__menu__item__search-history-close">
                                    <Button
                                      type="link"
                                      onClick={() => onCloseMenuSearch(status)}
                                      icon={
                                        !status ? (
                                          <UpOutlined />
                                        ) : (
                                          <DownOutlined />
                                        )
                                      }
                                    >
                                      {!status ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                  </div>
                                  {/* <CategorySearch
                            handleHiddenFormSearch={handleHiddenFormSearch}
                        /> */}
                                </div>
                              )}
                            </SearchComponent>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                  <div className="top_right">
                    <Dropdown
                      overlay={isLogged ? menuAccount : loginMenu}
                      arrow
                      placement="bottomCenter"
                      overlayClassName="overlay_account"
                    >
                      <div className="account">
                        <img
                          className="account_icon"
                          src="/images/user-icon.png"
                          alt="user"
                        />
                        <span className="account_text">
                          {userInfo._id !== '' ? (
                            <span className="nowrap">{`${userInfo.first_name} ${userInfo.last_name}`}</span>
                          ) : (
                            <span className="nowrap">Đăng Nhập / Đăng Ký</span>
                          )}
                          <span className="label">
                            <span>Tài khoản</span>
                            <img src="/images/arrow-icon.png" alt="arrow" />
                          </span>
                        </span>
                      </div>
                    </Dropdown>
                    <div className="cart" onClick={handleRedirectCart}>
                      <Link className="cart_link">
                        <div className="cart_wrap">
                          <img src="/images/cart-icon.png" alt="cart" />
                          <span>{cartQty || 0}</span>
                        </div>
                        <div className="cart_text">Giỏ Hàng</div>
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="header_main__bottom">
            <div className="header_main__bottom__wrap">
              <Row gutter={[{ xl: 0, lg: 0, md: 0, sm: 0, xs: 0 }, 0]}>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Link className="badge" to="#">
                    <img src="/images/freeship-badge.png" alt="freeship" />
                  </Link>
                </Col>
                <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                  <div className="quicks_search">
                    {histories?.map((item) => {
                      return (
                        <Link
                          to={`/products?search=${item.name.trim()}`}
                          key={item._id}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
