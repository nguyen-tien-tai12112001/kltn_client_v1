import { Col, Row, Affix } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import COMMON_API from '../../../api/common';
import PRODUCT_API from '../../../api/product';
import { Product } from '../../../components';
import './style.scss';
import TabItem from './TabItem';
import LoadingSection from '../../../components/LoadingSection';

const tabsList = [
  {
    id: 1,
    name: 'Dành cho bạn',
    img: 'https://salt.tikicdn.com/cache/w100/ts/personalish/f9/27/b5/3a8e2286a1c8fb91b67acc5ee35f82f0.png.webp',
  },
  {
    id: 2,
    name: 'Công nghệ-50%',
    img: 'https://salt.tikicdn.com/cache/w100/ts/tikimsp/f9/06/c5/e311e6a1a226a957263af02340060381.png.webp',
  },
  {
    id: 3,
    name: 'Giao nhanh 2H',
    img: 'https://salt.tikicdn.com/cache/w100/ts/tikimsp/fe/9d/c2/82ee137e6d61215b1b3f56d7dd7271a7.png.webp',
  },
  {
    id: 4,
    name: 'Quà tết 2022',
    img: 'https://salt.tikicdn.com/cache/w100/ts/product/13/aa/04/dbd4e7f81875aad528c539ed7e600088.png.webp',
  },
  {
    id: 5,
    name: 'Deal siêu hot',
    img: 'https://salt.tikicdn.com/cache/w100/ts/personalish/41/99/9a/8898607d7fca4b79775a708c57a8152f.png.webp',
  },
  {
    id: 6,
    name: 'Rẻ vô đối',
    img: 'https://salt.tikicdn.com/cache/w100/ts/personalish/0f/59/9d/215fa18ef72e430eefcbfe5355cab8e2.png.webp',
  },
  {
    id: 7,
    name: 'Xu hướng thời trang',
    img: 'https://salt.tikicdn.com/cache/w100/ts/personalish/dc/f1/b1/6ba9e529785de3ad1a81b9c569d05aa0.png.webp',
  },
  {
    id: 8,
    name: 'Dành cho bạn',
    img: 'https://salt.tikicdn.com/cache/w100/ts/personalish/0b/78/38/9708adb9dc0dcdee6940ec92dc99a11c.png.webp',
  },
];

const TodaySuggest = () => {
  const [todaySuggestProductsList, setTodaySuggestProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryActive, setCategoryActive] = useState(1);
  const [active, setActive] = useState(0);
  const tabFirst = {
    _id: 1,
    name: 'Dành cho bạn',
    image_url:
      'https://salt.tikicdn.com/cache/w100/ts/personalish/f9/27/b5/3a8e2286a1c8fb91b67acc5ee35f82f0.png.webp',
  };

  useEffect(() => {
    (async function () {
      try {
        const response = await COMMON_API.getCategories();
        setLoading(false);

        setCategoriesList([
          tabFirst,
          ...response.data.sort(() => 0.5 - Math.random()),
        ]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (categoryActive === 1) {
        try {
          const response = await COMMON_API.getAllProducts();

          setLoading(false);
          setTodaySuggestProductsList([...response.data]);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [categoryActive]);
  useEffect(() => {
    (async function () {
      if (categoryActive !== 1) {
        try {
          const response = await PRODUCT_API.queryProducts(
            `?categories=${categoryActive}`
          );
          setLoading(false);

          setTodaySuggestProductsList([...response.data]);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [categoryActive, setCategoryActive]);

  const handleActiveCategory = (name, index) => {
    setLoading(true);

    if (name === 'Dành cho bạn') {
      setCategoryActive(1);
    } else {
      setCategoryActive(index);
    }
  };

  return (
    <div id="today_suggest__home">
      <div className="today_suggest__home__wrap">
        {/* <Affix offsetTop={90}> */}
        <div className="today_suggest__header">
          <div className="today_suggest__header__wrap">
            <div className="today_suggest__header__title">Gợi Ý Hôm Nay</div>
            <div className="today_suggest__header__tabs">
              <Row gutter={[{ xl: 4, lg: 4, md: 4, sm: 4, xs: 4 }, 0]}>
                {categoriesList?.slice(0, 8).map((tabItem, index) => {
                  return (
                    <Col xl={3} lg={2} md={3} sm={4} xs={6} key={tabItem._id}>
                      <div
                        className={
                          categoryActive === tabItem._id
                            ? 'today_suggest__header__tab active'
                            : 'today_suggest__header__tab'
                        }
                        onClick={() =>
                          handleActiveCategory(tabItem.name, tabItem._id)
                        }
                      >
                        <TabItem tabItem={tabItem} />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </div>
        {/* </Affix> */}

        <div className="today_suggest__content">
          {loading && <LoadingSection />}
          {!loading && todaySuggestProductsList?.length > 0 && (
            <div className="today_suggest__list">
              <Row>
                {todaySuggestProductsList?.map((item) => {
                  return (
                    <Col xl={4} lg={6} md={8} sm={12} xs={12} key={item._id}>
                      <div className="today_suggest__item">
                        <Product data={item} />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
          <div className="today_suggest__view__more">
            <Link to="/products">Xem Thêm</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySuggest;
