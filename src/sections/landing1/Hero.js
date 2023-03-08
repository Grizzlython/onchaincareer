import React, { useEffect } from "react";

import { Select } from "../../components/Core";
import imgH from "../../assets/image/l1/png/hero-image-man.png";
import imgP from "../../assets/image/patterns/hero-pattern.png";
import Link from "next/link";
import { countries } from "../../staticData";
import ParticleArea from "./ParticleArea";
import Typed from "react-typed";
import { useConnection } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";

const Hero = () => {
  const [jobTitle, setJobTitle] = React.useState("");
  const [country, setCountry] = React.useState(countries[0]);
  const { connection } = useConnection();
  const gContext = React.useContext(GlobalContext);
  useEffect(() => {
    if (connection) {
      (async () => {
        await gContext.fetchAndSetAllListedCompanies(connection);
        await gContext.fetchAndSetAllJobListings(connection);
      })();
    }
  }, [connection]);
  return (
    <>
      {/* <!-- Hero Area --> */}
      <div
        className="bg-gradient-1 pt-26 pt-md-32 pt-lg-33 pt-xl-35 position-relative z-index-1 overflow-hidden"
        style={{
          paddingTop: "21rem !important",
        }}
      >
        {/* <!-- .Hero pattern --> */}
        <div className="pos-abs-tr w-50 z-index-n2">
          <img src={imgP.src} alt="" className="gr-opacity-1" />
        </div>
        {/* <!-- ./Hero pattern --> */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 100,
          }}
        >
          <ParticleArea></ParticleArea>
        </div>
        <div className="container">
          <div className="row position-relative align-items-center">
            <div
              className="col-xxl-6 col-xl-7 col-lg-8 col-md-12 pt-lg-13 pb-lg-33 pb-xl-34 pb-md-33 pb-10"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <h4 className="font-size-7 mb-12 pr-md-30 pr-lg-0">
                Find the &nbsp;
                <Typed
                  typedRef={(typed) => {
                    return typed;
                  }}
                  strings={["Perfect", "Suitable", "High Paying"]}
                  typeSpeed={40}
                  backSpeed={50}
                  backDelay={700}
                  showCursor={false}
                  style={{
                    background: "#33b073",
                    padding: "0px 10px",
                    color: "white",
                    fontSize: "2rem",
                  }}
                  loop
                >
                  {/* <span>{animatedText}</span> */}
                </Typed>{" "}
                job that you deserve.
              </h4>
              <div className="">
                {/* <!-- .search-form --> */}
                <form action="/" className="search-form shadow-6">
                  <div className="filter-search-form-1 bg-white rounded-sm shadow-4">
                    <div className="filter-inputs">
                      <div className="form-group position-relative">
                        <input
                          className="form-control focus-reset pl-13"
                          type="text"
                          id="keyword"
                          placeholder="Job title"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                        <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                          <i className="icon icon-zoom-2 text-primary font-weight-bold"></i>
                        </span>
                      </div>
                      {/* <!-- .select-city starts --> */}
                      <div className="form-group position-relative">
                        <Select
                          options={countries}
                          className="pl-8 h-100 arrow-3 font-size-4 d-flex align-items-center w-100"
                          border={false}
                          value={country}
                          onChange={setCountry}
                        />

                        <span className="h-100 w-px-50 pos-abs-tl d-flex align-items-center justify-content-center font-size-6">
                          <i className="icon icon-pin-3 text-primary font-weight-bold"></i>
                        </span>
                      </div>
                      {/* <!-- ./select-city ends --> */}
                    </div>
                    {/* <!-- .Hero Button --> */}
                    <Link
                      href={`/search-jobs?jobTitle=${jobTitle}&country=${country?.value}`}
                    >
                      <div className="button-block">
                        <button className="btn btn-primary line-height-reset h-100 btn-submit w-100 text-uppercase">
                          Search
                        </button>
                      </div>
                    </Link>
                    {/* <!-- ./Hero Button --> */}
                  </div>
                </form>
                {/* <!-- ./search-form --> */}
                <p className="heading-default-color font-size-3 pt-7">
                  <span className="text-smoke">Search keywords e.g.</span>{" "}
                  Blockchain Developer
                </p>
              </div>
            </div>
            {/* <!-- Hero Right Image --> */}
            <div
              className="col-lg-6 col-md-4 col-sm-6 col-xs-6 col-8 pos-abs-br z-index-n1 position-static position-md-absolute mx-auto ml-md-auto"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="500"
              style={{
                zIndex: 0,
              }}
            >
              <div className=" ml-xxl-23 ml-xl-12 ml-md-7">
                <img
                  src={imgH.src}
                  alt=""
                  className="w-100"
                  style={{
                    maxWidth: "90%",
                  }}
                />
              </div>
            </div>
            {/* <!-- ./Hero Right Image --> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
