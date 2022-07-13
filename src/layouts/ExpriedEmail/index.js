import { Result } from 'antd';
import { Link } from 'react-router-dom';
const ExpriedEmail = ({ status, title, subTitle }) => {
  return (
    <div id="result">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={<Link to="/auth/register">Đăng ký!</Link>}
      />
    </div>
  );
};

export default ExpriedEmail;
