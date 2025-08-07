import PropTypes from 'prop-types';

const ComponentCard = ({ children, title, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <h6 className="text-gray-600 mb-4">{subtitle}</h6>
      <div>{children}</div>
    </div>
  );
};

ComponentCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.node,
};

export default ComponentCard;
