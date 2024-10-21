"use client";

import Snowfall from "react-snowfall";

export const ChristmasSnow = () => {
  return (
    <Snowfall
      style={{
        position: "fixed",
        zIndex: 0,
        width: "100vw",
        height: "100vh",
      }}
      //color={"#fff"}
      //snowflakeCount={100}
      //style={{zIndex: 9999}}
    />
  );
};