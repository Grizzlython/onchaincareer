import React from "react";
import Link from "next/link";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import { useContext } from "react";
import { defaultCategories } from "../../staticData";

const Categories = () => {
  const gContext = useContext(GlobalContext);

  // useEffect(() => {
  //   // gContext.getCategories({ limit: 8 });
  // }, []);

  return (
    <>
      {/* <!-- Categories Area -->  */}
      <div
        className="pt-11 pt-lg-26 pb-lg-16"
        data-aos="fade-left"
        data-aos-duration="800"
        data-aos-delay="500"
      >
        <div className="container">
          {/* <!-- Section Top --> */}
          <div className="row align-items-center pb-14">
            {/* <!-- Section Title --> */}
            <div className="col-12 col-lg-6">
              <div className="text-center text-lg-left mb-13 mb-lg-0">
                <h2 className="font-size-9 font-weight-bold">
                  Explore by category
                </h2>
              </div>
            </div>
            {/* <!-- Section Button --> */}
            <div className="col-12 col-lg-6">
              <div className="text-center text-lg-right">
                <Link href="/search-jobs">
                  <a
                    className="btn btn-outline-green text-uppercase"
                  >
                    Explore All
                  </a>
                </Link>
              </div>
            </div>
            {/* <!-- Section Button End --> */}
          </div>
          {/* <!-- End Section Top --> */}
          <div className="row justify-content-center">
            {/* <!-- Single Category --> */}
            {defaultCategories.map((category, index) => (
              <div
                className="col-12 col-xl-3 col-lg-4 col-sm-6 col-xs-8"
                key={index}
              >
                <Link href={`/search-jobs?category=${category.value}`}>
                  <a className="bg-white border border-color-2 rounded-4 pl-9 pt-10 pb-3 pr-7 hover-shadow-1 mb-9 d-block w-100">
                    <div className="text-blue bg-blue-opacity-1 square-70 rounded-4 mb-7 font-size-7">
                      <i className="fa fa-briefcase"></i>
                    </div>
                    {/* <!-- Category Content --> */}
                    <div className="">
                      <h5 className="font-size-5 font-weight-semibold text-black-2 line-height-1">
                        {
                          // capitalize first letter of each word
                          category.label
                            .split(" ")
                            .map(
                              (word) => word[0].toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        }
                      </h5>
                      {/* <p className="font-size-4 font-weight-normal text-gray">
                        <span>{category.jobsInCategory}</span> Jobs posted
                      </p> */}
                    </div>
                  </a>
                </Link>
              </div>
            ))}

            {/* <!-- End Single Category --> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
