// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import {UpIcon} from '../../../assets';
import PropTypes from 'prop-types';

const ScrollToTop = ({ container }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (container.current && container.current.scrollTop >= 150) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    const containerElement = container.current;
    if (containerElement) {
      containerElement.addEventListener('scroll', onScroll);

      return () => {
        containerElement.removeEventListener('scroll', onScroll);
      };
    }
  }, [container]);

  return (
      <img style={active ? {bottom:"1rem"}:{bottom:"-3rem"}} onClick={() => container.current.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-[50px] h-[50px] fixed transition-all cursor-pointer duration-300 opacity-100 right-9"
        src={UpIcon}
        alt="Scroll to Up"
      />
  );
};

ScrollToTop.propTypes = {
  container: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default ScrollToTop;
