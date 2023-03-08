import React from "react";
import Link from "next/link";

import Clgo from "../../assets/image/Clgo.png";

const Logo = ({ white, height, className = "", ...rest }) => {
  return (
    <Link href="/">
      <a className={`d-block ${className}`} {...rest}>
        {white ? <img src={Clgo.src} alt="" /> : <img src={Clgo.src} alt="" />}
      </a>
    </Link>
  );
};

export default Logo;
