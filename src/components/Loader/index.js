import { useState } from "react";
import BounceLoader from "react-spinners/BounceLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#008a5b");
  return (
    <>
      <BounceLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={75}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  );
};

export default Loader;
