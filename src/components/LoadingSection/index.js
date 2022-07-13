import { LoadingOutlined } from '@ant-design/icons';

const LoadingSection = ({ size }) => {
  return (
    <div
      style={{
        width: '100%',
        padding: '32px 0px',
        background: 'white',
        textAlign: 'center',
        minHeight: 300,
      }}
      className="loading__section-container"
    >
      <LoadingOutlined style={{ fontSize: size || 32 }} />
    </div>
  );
};

export default LoadingSection;
