import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import CategorySearch from './CategorySearch';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { getSearchItemUserApi } from '../../../Store/Reducer/searchItem';

let search_item = [
  {
    id: 1,
    content: 'Điện thoại IPhone',
    status: 'searchAI',
  },
  {
    id: 2,
    content: 'Điện thoại Samsung',
    status: 'searchAI',
  },
  {
    id: 3,
    content: 'Điện thoại Oppo',
    status: 'searchAI',
  },
  {
    id: 4,
    content: 'Điện thoại Huawai',
    status: 'searchAI',
  },
  {
    id: 5,
    content: 'Macbook Pro',
    status: 'searchAI',
  },
  {
    id: 6,
    content: 'Ipad Ari',
    status: 'searchAI',
  },
  {
    id: 7,
    content: 'Macbook Pro',
    status: 'searchAI',
  },
];

const SearchComponent = styled.div`
  .header__menu__right__item {
    position: relative;
    margin-right: 35px;
  }
  .header__menu__item__search-dropdown-menu-search {
    position: absolute;
    height: 50px;
    height: auto;
    top: 110%;
    right: -70%;
    background: #fff;
    box-shadow: 0px 2px 25px 1px #e6e6e6;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.25s ease-in-out;
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

export default function Search(props) {
  let arrSearchItem = [];
  const { searchItem, insertSearchItemUser, removeSearchItem } = props;
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(true);
  const [height, setHeight] = useState(110);
  const [inputSearch, setInputSearch] = useState('');
  const [display, setDisplay] = useState('block');
  const [searchAll, setSearchAll] = useState([]);

  useEffect(() => {
    if (searchItem) {
      setSearchAll([...searchItem, ...search_item]);
    }
  }, [searchItem]);

  const handleHeightSearchItem = (items) => {
    const arr_items = items.slice(2);
    return arr_items.length * 50;
  };

  const setActiveClass = () => {
    if (inputSearch) {
      insertSearchItemUser(inputSearch);
    }
    if (searchRef.current) {
      if (searchItem === null) {
        // dispatch(getSearchItemUserApi());
      }
      searchRef.current.classList.add('active');
      dropdownRef.current.classList.remove('hidden');
    }
  };

  const removeActiveClass = () => {
    if (searchRef.current) {
      searchRef.current.classList.remove('active');
      dropdownRef.current.classList.add('hidden');
      inputRef.current.value = '';
      setInputSearch('');
    }
  };

  const onCloseMenuSearch = (s) => {
    const height_search = handleHeightSearchItem(searchAll);
    if (s) {
      setHeight(110 + height_search);
      setStatus(!s);
    } else {
      setHeight(height - height_search);
      setStatus(!s);
    }
  };

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        !e.target.closest('.header__menu__item__search-wrap') &&
        !e.target.closest('.header__menu__item__search-dropdown-menu-search')
      ) {
        if (dropdownRef.current) {
          dropdownRef.current.classList.add('hidden');
          setHeight(110);
          setStatus(true);
        }
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', (e) => {
        if (dropdownRef.current) {
          dropdownRef.current.classList.remove('hidden');
        }
      });
    }
    return () => {
      if (inputRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        inputRef.current.removeEventListener('focus', null);
      }
    };
  }, []);

  const handleHiddenFormSearch = (status) => {
    if (status) {
      if (dropdownRef.current) {
        dropdownRef.current.classList.add('hidden');
        searchRef.current.classList.remove('active');
      }
    }
  };

  const heightSearch = () => {
    return height <= 350 ? height : 350;
  };

  const handleImportContentSearch = (data) => {
    return data ? `/search/${data}` : '#';
  };

  const handleChangeInputToSearch = (value, e) => {
    if (!e.target.closest('.icon-delete')) {
      setInputSearch(value);
      insertSearchItemUser(value);
    }
  };

  const renderUISearch = (arrSearchItem) => {
    return arrSearchItem.length
      ? arrSearchItem.map((item, index) => {
          if (item.status === 'searchAI') {
            return (
              <div
                className="header__menu__item__search-item"
                key={index}
                onClick={(e) => handleChangeInputToSearch(item.content, e)}
              >
                <Link
                  to={handleImportContentSearch(item.content)}
                  style={{ width: '100%' }}
                >
                  <div className="header__menu__item__search-item-content">
                    <i className="fad fa-search"></i>
                    <p className="header__menu__item__search-text">
                      {item.content}
                    </p>
                  </div>
                </Link>
              </div>
            );
          } else {
            return (
              <div
                className="header__menu__item__search-item"
                key={index}
                onClick={(e) => handleChangeInputToSearch(item.content, e)}
              >
                <Link
                  to={() => handleImportContentSearch(item.content)}
                  style={{ width: '100%' }}
                >
                  <div className="header__menu__item__search-item-content">
                    <i className="fad fa-history"></i>
                    <p className="header__menu__item__search-text">
                      {item.content}
                    </p>
                  </div>
                </Link>
                <i
                  className="fal fa-times icon-delete"
                  onClick={() => removeSearchItem(item._id)}
                ></i>
              </div>
            );
          }
        })
      : '';
  };

  const handleChangeInputSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const renderUISearchSame = () => {
    if (inputSearch) {
      arrSearchItem = searchAll.filter((text) => {
        return text.content.toLowerCase().indexOf(inputSearch) !== -1;
      });
    }
    if (arrSearchItem.length) {
      return renderUISearch(arrSearchItem);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    arrSearchItem = searchAll.filter((text) => {
      return text.content.toLowerCase().indexOf(inputSearch) !== -1;
    });
    setDisplay(arrSearchItem.length ? 'block' : 'none');
  }, [inputSearch]);

  const handleChangeLink = () => (inputSearch ? `/search/${inputSearch}` : '#');

  return (
    <SearchComponent>
      <div className="header__menu__item header__menu__right__item">
        <div
          className="header__menu__item__search-wrap"
          ref={searchRef}
          id="search"
        >
          <Link to={handleChangeLink}>
            <div
              className="header__menu__item__btn-search"
              onClick={() => setActiveClass()}
              // style={{ color: themeItem.text_color }}
            >
              <i className="fal fa-search"></i>
            </div>
          </Link>

          <div
            className="header__menu__item__input-search"
            // style={{ color: themeItem.text_color }}
          >
            <input
              type="text"
              placeholder="tìm kiếm sản phẩm ..."
              value={inputSearch}
              ref={inputRef}
              onChange={(e) => handleChangeInputSearch(e)}
            />
          </div>
          <div
            className="header__menu__item__btn-search-off"
            onClick={removeActiveClass}
          >
            <i className="fal fa-times"></i>
          </div>
        </div>
        {inputSearch ? (
          <div
            className="header__menu__item__search-dropdown-menu-search"
            ref={dropdownRef}
            id="dropdown"
          >
            <div
              className="header__menu__item__search-history"
              style={{ height: 'auto', display: display }}
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
              {renderUISearch(searchAll)}
            </div>
            <div className="header__menu__item__search-history-close">
              <Button
                type="dashed"
                onClick={() => onCloseMenuSearch(status)}
                icon={!status ? <UpOutlined /> : <DownOutlined />}
              >
                {!status ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            </div>
            {/* <CategorySearch handleHiddenFormSearch={handleHiddenFormSearch} /> */}
          </div>
        )}
      </div>
    </SearchComponent>
  );
}
