import React from 'react';
import { SectionBody } from '../../Section';
import Grid from '../../Grid';
import { Link } from 'react-router-dom';

const category_search = [
  {
    title: 'Điện thoại SmartPhone',
    keyWord: '/mobile/điện-thoại-smart-phone',
    image:
      'https://salt.tikicdn.com/cache/280x280/ts/product/0c/62/39/31879ad1c9cf92b35e58749268ba4ff7.jpg',
    active: true,
  },
  {
    title: 'Điện thoại Phổ Thông',
    keyWord: '/mobile/điện-thoại-phổ-thông',
    image:
      'https://salt.tikicdn.com/cache/280x280/ts/product/41/6a/02/0f72d327972ffc0920bc51a67bb651d0.jpg',
    active: true,
  },
  {
    title: 'Máy Tính Bảng',
    keyWord: '/tablet/tất-cả-sản-phẩm',
    image:
      'https://salt.tikicdn.com/cache/200x200/ts/product/28/3d/83/5171f45db2b034aab1e5ccff0cfacb62.jpg.webp',
    active: true,
  },
  {
    title: 'Laptop Chính Hãng',
    keyWord: '/laptop/tất-cả-sản-phẩm',
    image: 'https://pngimg.com/uploads/macbook/small/macbook_PNG3.png',
    active: true,
  },
  {
    title: 'Tai Nghe Cực Cool',
    keyWord: '/noUrl/404',
    image:
      'https://salt.tikicdn.com/cache/200x200/media/catalog/product/t/r/tr_ng-1_9_1_.jpg.webp',
    active: false,
  },
  {
    title: 'Bàn Phím',
    keyWord: '/noUrl/404',
    image:
      'https://salt.tikicdn.com/cache/200x200/ts/product/7e/d2/1c/d6d94c02949f90f482a33bac437277b3.jpg.webp',
    active: false,
  },
  {
    title: 'Chuột',
    keyWord: '/noUrl/404',
    image:
      'https://salt.tikicdn.com/cache/200x200/ts/product/48/ec/cb/ca09fd50f3bc5e14fcdee95103626219.jpg.webp',
    active: false,
  },
  {
    title: 'Thẻ Nhớ',
    keyWord: '/noUrl/404',
    image:
      'https://salt.tikicdn.com/cache/280x280/ts/product/8b/1e/7a/0715352cc631df3077b8fa00f492dbda.jpg',
    active: false,
  },
];
function CategorySearch(props) {
  const { handleHiddenFormSearch } = props;
  return (
    <div className="header__menu__item__search-category">
      <p className="header__menu__item__search-category-title">
        Danh Mục Nổi Bật
      </p>
      <SectionBody>
        <Grid col={4} mdCol={2} smCol={1} gap={10}>
          {category_search.map((item, index) => (
            <Link
              to={item.active ? item.keyWord : '#'}
              key={index}
              onClick={() => handleHiddenFormSearch(item.active)}
            >
              <div className="header__menu__item__search-category-item">
                <div className="header__menu__item__search-category-item-img">
                  <img alt="iphone" src={item.image} />
                </div>
                <p className="header__menu__item__search-category-item-name">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </Grid>
      </SectionBody>
    </div>
  );
}

export default CategorySearch;
