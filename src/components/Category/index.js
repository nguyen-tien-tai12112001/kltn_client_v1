import { Link } from 'react-router-dom';
import './style.scss';

const Category = ({ data }) => {
  return (
    <div id="category_component">
      <Link
        to={`/products?categories=${data._id}`}
        className="category_component__wrap"
      >
        <div className="category_component__header">
          <div className="thumbnail">
            <img src={data.image_url} alt="category" />
          </div>
          <p className="title">{data.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default Category;
