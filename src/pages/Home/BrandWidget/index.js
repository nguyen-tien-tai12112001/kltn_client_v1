import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import COMMON_API from '../../../api/common';
import { Brand, MySlick } from '../../../components';
import './style.scss';
import { Row } from 'antd';
import Slider from 'react-slick';
const slide_price_shock = [
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-98.png',
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-100.png',
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-102.png',
  'https://cdn.tgdd.vn/2021/08/banner/lapevo-800-200-800x200-1.png',
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-108.png',
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-95.png',
  'https://cdn.tgdd.vn/2021/08/banner/800-200-800x200-101.png',
];
const BrandWidget = () => {
  const [brandsList, setBrandsList] = useState([]);
  const settings = {
    // dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };
  useEffect(() => {
    (async function () {
      try {
        const response = await COMMON_API.getBrands();

        setBrandsList(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div id="brand_widget__home">
      <div className="brand_widget__home__wrap">
        <div className="brand_widget__header">
          <div className="title">
            <div className="title_img">
              <img
                src="https://salt.tikicdn.com/ts/upload/33/0f/67/de89fab36546a63a8f3a8b7d038bff81.png"
                alt="brand"
              />
            </div>
            <div className="title_text">Thương Hiệu Chính Hãng</div>
          </div>
          <div className="see_more">
            <Link to="/products">XEM THÊM</Link>
          </div>
        </div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: 5 }}>
          <div
            style={{
              width: '100%',
              display: true,
            }}
          >
            <Slider {...settings}>
              {slide_price_shock.map((item, index) => (
                <div className="product-slide-item" key={index}>
                  <img alt="" style={{ width: '100%' }} src={item} />
                </div>
              ))}
            </Slider>
          </div>
        </Row>

        <div className="brand_widget__cards">
          <MySlick dots={true} xl={6} md={6} lg={6} sm={6} xxl={6}>
            {brandsList?.map((item) => {
              return (
                <div className="brand_widget__item" key={item.id}>
                  <Brand data={item} />
                </div>
              );
            })}
          </MySlick>
        </div>
      </div>
    </div>
  );
};

export default BrandWidget;
