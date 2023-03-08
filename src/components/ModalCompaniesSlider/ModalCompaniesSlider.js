import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";
import SlickSlider from "react-slick";
import imgT1 from "../../assets/image/l3/png/testimonial.png";
import imgTB from "../../assets/image/l3/png/testimonial-brand-logo.png";

import { useEffect } from "react";
import Link from "next/link";
import Slider from "../../sections/landing3/Slider";

const currentEmploymentStatus = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "self-Employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
];

const canJoinIn = [
  { value: "immediately", label: "Immediately" },
  { value: "within 1 month", label: "1 Month" },
  { value: "within 2 months", label: "2 Months" },
  { value: "within 3 months", label: "3 Months" },
  { value: "later", label: "More than 3 months" },
];

const SliderItem = styled.div`
  &:focus {
    outline: none;
  }
`;

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalCompaniesSlider = (props) => {
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const gContext = useContext(GlobalContext);

  const {
    showSelectCompanyModal,
    toggleSelectCompanyModal,
    userInfoState,
    fetchAndSetAllListedCompaniesByUser,
    allListedCompaniesByUser,
  } = gContext;

  const handleClose = () => {
    toggleSelectCompanyModal();
  };

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  console.log(allListedCompaniesByUser, "allListedCompaniesByUser");

  return (
    <ModalStyled
      {...props}
      size="xl"
      centered
      show={showSelectCompanyModal}
      onHide={toggleSelectCompanyModal}
      backdrop="static"
    >
      <Modal.Body
        className="p-0"
        // style={{
        //   backgroundColor: "#e5e5e5",
        // }}
      >
        <button
          type="button"
          className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <>
          <div className="bg-black-2 pattern-1 bg-image pt-13 pt-lg-31 pb-24 pb-lg-33 overflow-hidden">
            <div className="container">
              <div className="row justify-content-center">
                <div className="" data-aos="fade-in" data-aos-duration="1000">
                  {allListedCompaniesByUser &&
                  allListedCompaniesByUser.length > 0 ? (
                    allListedCompaniesByUser?.map((company, index) => (
                      <SlickSlider
                        {...settings}
                        className="testimonial-slider-one"
                      >
                        <SliderItem
                          className="single-slider bg-white rounded-4"
                          key={index}
                        >
                          <div className="row no-gutters align-items-center justify-content-center">
                            <div className="col-12 col-xl-5 col-lg-5">
                              {/* <!-- Slide Image --> */}
                              <div className="slide-img">
                                <img
                                  className="rounded-left w-100"
                                  src={imgT1.src}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-12 col-xl-7 col-lg-7 col-xs-10">
                              {/* <!-- Slide content Start --> */}
                              <div className="slide-content pl-5 pl-lg-10 pl-xxl-20 pr-5 pr-xl-5 py-lg-5 py-9">
                                {/* <!-- Slide Brand Image --> */}
                                <div className="mb-11">
                                  <img src={imgTB.src} alt="" />
                                </div>
                                {/* <!-- Slide Info --> */}
                                <div className="">
                                  <p className="font-size-6 text-black-2 pr-5 mb-10">
                                    “Being a small but growing brand, we have to
                                    definitely do a lot more with less. And when
                                    you want to create a business bigger than
                                    yourself, you’re going to need help. And
                                    that’s what Justcamp does.”
                                  </p>
                                  {/* <!-- User Info --> */}
                                  <div className="">
                                    <h4 className="font-size-6 text-black-2 mb-0">
                                      Brandon & Rivera
                                    </h4>
                                    <span className="font-size-4 text-gray">
                                      Co-founders of Greener
                                    </span>
                                  </div>
                                </div>
                                {/* <!-- Slide Info End --> */}
                              </div>
                              {/* <!-- Slide content End --> */}
                            </div>
                          </div>
                        </SliderItem>
                      </SlickSlider>
                    ))
                  ) : (
                    <h5>No companies found</h5>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <Slider /> */}
        </>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalCompaniesSlider;
