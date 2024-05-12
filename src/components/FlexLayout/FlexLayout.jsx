import React from 'react';
import PropTypes from 'prop-types';

const FlexLayout = ({ direction, justifyContent, alignItems, margin, padding, className, children }) => {
  const style = {
    display: 'flex',
    flexDirection: direction,
    justifyContent,
    alignItems: alignItems,
    width: '100%',
    height: '100%',
    margin,
    padding,
  };

  return <div className={className} style={style}>{children}</div>;
};

FlexLayout.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']),
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  alignItems: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),
  margin: PropTypes.number,
  padding: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FlexLayout.defaultProps = {
  direction: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  margin: 8,
  padding: 8,
};

export default FlexLayout;
