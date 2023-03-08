import React, { useContext, useEffect } from "react";

import GlobalContext from "../../context/GlobalContext";

const Brands = () => {
  const gContext = useContext(GlobalContext);

  const { allListedCompanies } = gContext;
  return (
    <>
      {/* <!-- Brands Area --> */}
      <div className="bg-black-2 dark-mode-texts pt-lg-12 pb-12 pb-lg-23">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title mb-12 text-center text-lg-left">
                {/* <h2 className="font-size-8 font-weight-normal">
                  Companies that trust us
                </h2> */}
                <h2 className="font-size-9 font-weight-bold">
                  Companies that trust us
                </h2>
              </div>
            </div>
          </div>
          {/* <!-- Brand Logos --> */}
          <div className="row align-items-center justify-content-start">
            {allListedCompanies &&
              allListedCompanies.length > 0 &&
              allListedCompanies.map((company) => (
                <div
                  className="single-brand-logo mx-5"
                  data-aos="fade-in"
                  data-aos-duration="800"
                >
                  <img
                    src={company.logo_uri}
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              ))}
          </div>
          {/* <!-- End Brand Logos --> */}
        </div>
      </div>
    </>
  );
};

export default Brands;
