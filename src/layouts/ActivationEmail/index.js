import { Result } from 'antd';
import { Link } from 'react-router-dom';

const ActivationEmail = ({ status, title, subTitle }) => {
  return (
    <div id="result">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <a href="https://mail.google.com/">
            Xác nhận trong email để có thể tiếp tục!!!!
          </a>
        }
      />
    </div>
  );
};

export default ActivationEmail;
