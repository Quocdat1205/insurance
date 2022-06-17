import React from "react";
import Head from "next/head";
import { HeaderType } from "src/types";

const Header = (_props: HeaderType) => {
  const { title, image } = _props;

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href={image} />
    </Head>
  );
};

export default Header;
