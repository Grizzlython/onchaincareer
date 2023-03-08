import React from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SUBSCRIPTION_PLANS_enum, SUBSCRIPTION_PLANS_PRICES } from "../utils/web3/struct_decoders/jobsonchain_constants_enum";
import { purchase_subscription_plan } from "../utils/web3/web3_functions";
import { toast } from "react-toastify";

export default function Pricing() {
  const { publicKey, wallet, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  const handlePaymentOfPlan = async (plan_type) =>{
    if(!publicKey){
      alert("Please connect your wallet first.")
      return;
    }
    try{
      await purchase_subscription_plan(wallet.adapter, publicKey, connection, plan_type);
      toast.success("Plan purchased successfully.")
    }catch(err){
      console.log(err)
      toast.error("Error while purchasing plan. Please try again later.")
    }
  }

  return (
    <>
      <PageWrapper>
        <div className="pt-md pt-17">
          {/* <!-- pricing area function start --> */}
          {/* <!-- pricing section --> */}
          <div className="pricing-area">
            <div className="container pt-12 pt-lg-24 pb-13 pb-lg-25">
              <div className="row justify-content-center">
                <div
                  className="col-xxl-6 col-lg-7 col-md-9"
                  data-aos="fade-in"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                >
                  {/* <!-- section-title start --> */}
                  <div className="section-title text-center mb-12 mb-lg-18 mb-lg-15 pb-lg-15 pb-0">
                    <h2 className="mb-9">
                      Choose the best plan for you.
                    </h2>
                    <p className="text-default-color font-size-4 px-5 px-md-10 px-lg-15 px-xl-24 px-xxl-22">
                      World's first fully decentralized job portal.
                    </p>
                  </div>
                  {/* <!-- section-title end --> */}
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-xxl-10 col-xl-11">
                  <div className="row justify-content-center">
                  <div
                      className="col-lg-4 col-md-6 col-xs-9"
                      data-aos="fade-right"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                    >
                      {/* <!-- card start --> */}
                      <div className="card border-mercury rounded-8 mb-lg-3 mb-9 px-xl-12 px-lg-8 px-12 pb-12 hover-shadow-hitgray">
                        {/* <!-- card-header start --> */}
                        <div className="card-header bg-transparent border-hit-gray-opacity-5 text-center pt-11 pb-8">
                          <div className="pricing-title text-center">
                            <h5 className="font-weight-semibold font-size-6 text-black-2">
                              Default Plan
                            </h5>
                            <h6 className="font-size-4 text-gray font-weight-normal">
                              Pay per use
                            </h6>
                          </div>
                          <h2 className="mt-11 text-dodger">
                            
                          </h2>
                        </div>
                        {/* <!-- card-header end --> */}
                        {/* <!-- card-body start --> */}
                        <div className="card-body px-0 pt-11 pb-15">
                          <ul className="list-unstyled">
                            
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited Job Postings ($20/job)
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              View Job Applicants social ($1/applicant)
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              By default activated for each company
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <!-- card end --> */}
                    </div>
                    <div
                      className="col-lg-4 col-md-6 col-xs-9"
                      data-aos="fade-right"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                    >
                      {/* <!-- card start --> */}
                      <div className="card border-mercury rounded-8 mb-lg-3 mb-9 px-xl-12 px-lg-8 px-12 pb-12 hover-shadow-hitgray">
                        {/* <!-- card-header start --> */}
                        <div className="card-header bg-transparent border-hit-gray-opacity-5 text-center pt-11 pb-8">
                          <div className="pricing-title text-center">
                            <h5 className="font-weight-semibold font-size-6 text-black-2">
                              Monthly Plan
                            </h5>
                            <h6 className="font-size-4 text-gray font-weight-normal">
                              $USDC {SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.MONTHLY].price}
                            </h6>
                          </div>
                          <h2 className="mt-11 text-dodger">
                            ${SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.MONTHLY].price}
                            <span className="font-size-4 text-smoke font-weight-normal">
                              /month
                            </span>
                          </h2>
                        </div>
                        {/* <!-- card-header end --> */}
                        {/* <!-- card-body start --> */}
                        <div className="card-body px-0 pt-11 pb-6">
                          <ul className="list-unstyled">
                            
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited Job Postings (${SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.MONTHLY].job_posting_price}/job)
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited View Job Applicants
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Job Alert Emails
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              *Plan valid for selected company
                            </li>
                          </ul>
                        </div>
                        {/* <!-- card-body end --> */}
                        {/* <!-- card-footer end --> */}
                        <div className="card-footer bg-transparent border-0 px-0 py-0">
                          
                            <a className="btn btn-green btn-h-60 text-white rounded-5 btn-block text-uppercase" onClick={()=>handlePaymentOfPlan(SUBSCRIPTION_PLANS_enum.MONTHLY)}>
                              Start with Monthly
                            </a>
                          
                        </div>
                        {/* <!-- card-footer end --> */}
                      </div>
                      {/* <!-- card end --> */}
                    </div>
                    <div
                      className="col-lg-4 col-md-6 col-xs-9"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                    >
                      {/* <!-- card start --> */}
                      <div className="card border-mercury recomended-pricing rounded-8 mb-lg-3 mb-9 px-xl-12 px-lg-8 px-12 pb-12 mt-lg-n13 hover-shadow-hitgray">
                        {/* <!-- card-header start --> */}
                        <div className="card-header bg-transparent border-hit-gray-opacity-5 text-center pt-10 pb-8">
                          <div className="pricing-title text-center">
                            <span className="font-size-3 font-weight-bold text-uppercase text-dodger mb-9 d-inline-block">
                              RECOMMENDED
                            </span>
                            <h5 className="font-weight-semibold font-size-6 text-black-2">
                              Six Months Plan
                            </h5>
                            <h6 className="font-size-4 text-gray font-weight-normal">
                              $USDC {SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.SIXMONTHS].price}
                            </h6>
                          </div>
                          <h2 className="mt-11 text-dodger">
                          ${(SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.SIXMONTHS].price/6).toFixed(0)}
                            <span className="font-size-4 text-smoke font-weight-normal">
                              /month
                            </span>{" "}
                          </h2>
                        </div>
                        {/* <!-- card-header end --> */}
                        {/* <!-- card-body start --> */}
                        <div className="card-body px-0 pt-11 pb-6">
                          <ul className="list-unstyled">
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited Job Postings (${SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.SIXMONTHS].job_posting_price}/job)
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited View Applied Candidate's social
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Job Alert Emails
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              *Plan valid for selected company
                            </li>
                          </ul>
                        </div>
                        {/* <!-- card-body end --> */}
                        {/* <!-- card-footer end --> */}
                        <div className="card-footer bg-transparent border-0 px-0 py-0">
                          
                            <a className="btn btn-green btn-h-60 text-white rounded-5 btn-block text-uppercase" onClick={()=>handlePaymentOfPlan(SUBSCRIPTION_PLANS_enum.SIXMONTHS)}>
                              Start with Six Monthly
                            </a>
                          
                        </div>
                        {/* <!-- card-footer end --> */}
                      </div>
                      {/* <!-- card end --> */}
                    </div>
                    <div
                      className="col-lg-4 col-md-6 col-xs-9"
                      data-aos="fade-left"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                    >
                      {/* <!-- card start --> */}
                      <div className="card border-mercury rounded-8 mb-3 px-xl-12 px-lg-8 px-12 pb-12 hover-shadow-hitgray">
                        {/* <!-- card-header start --> */}
                        <div className="card-header bg-transparent border-hit-gray-opacity-5 text-center pt-11 pb-8">
                          <div className="pricing-title text-center">
                            <h5 className="font-weight-semibold font-size-6 text-black-2">
                              Yearly Plan
                            </h5>
                            <h6 className="font-size-4 text-gray font-weight-normal">
                            $USDC {SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.YEARLY].price}
                            </h6>
                          </div>
                          <h2 className="mt-11 text-dodger">
                            ${(SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.YEARLY].price/12).toFixed(0)}
                            <span className="font-size-4 text-smoke font-weight-normal">
                              /month
                            </span>{" "}
                          </h2>
                        </div>
                        {/* <!-- card-header end --> */}
                        {/* <!-- card-body start --> */}
                        <div className="card-body px-0 pt-11 pb-6">
                          <ul className="list-unstyled">
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited Job Postings (${SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.YEARLY].price}/job)
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited View Applied Candidate's social
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Job Alert Emails
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Access to all the Applicants in the platform
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              *Plan valid for selected company
                            </li>
                          </ul>
                        </div>
                        {/* <!-- card-body end --> */}
                        {/* <!-- card-footer end --> */}
                        <div className="card-footer bg-transparent border-0 px-0 py-0">
                          
                            <a className="btn btn-green btn-h-60 text-white rounded-5 btn-block text-uppercase" onClick={()=>handlePaymentOfPlan(SUBSCRIPTION_PLANS_enum.YEARLY)}>
                              Start with Yearly
                            </a>
                          
                        </div>
                        {/* <!-- card-footer end --> */}
                      </div>
                      {/* <!-- card end --> */}
                    </div>
                    <div
                      className="col-lg-4 col-md-6 col-xs-9"
                      data-aos="fade-left"
                      data-aos-duration="1000"
                      data-aos-delay="500"
                    >
                      {/* <!-- card start --> */}
                      <div className="card border-mercury rounded-8 mb-3 px-xl-12 px-lg-8 px-12 pb-12 hover-shadow-hitgray">
                        {/* <!-- card-header start --> */}
                        <div className="card-header bg-transparent border-hit-gray-opacity-5 text-center pt-11 pb-8">
                          <div className="pricing-title text-center">
                            <h5 className="font-weight-semibold font-size-6 text-black-2">
                              Forever Plan
                            </h5>
                            <h6 className="font-size-4 text-gray font-weight-normal">
                              $USDC {SUBSCRIPTION_PLANS_PRICES[SUBSCRIPTION_PLANS_enum.FOREVER].price}
                            </h6>
                          </div>
                          <h3 className="mt-11 text-dodger">
                            Forever Free
                          </h3>
                        </div>
                        {/* <!-- card-header end --> */}
                        {/* <!-- card-body start --> */}
                        <div className="card-body px-0 pt-11 pb-6">
                          <ul className="list-unstyled">
                            
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited Job Postings
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Unlimited View Applied Candidate's social
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Job Alert Emails
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              Access to all the Applicants in the platform
                            </li>
                            <li className="mb-6 text-black-2 d-flex font-size-4">
                              <i className="fas fa-check font-size-3 text-black-2 mr-3"></i>{" "}
                              *Plan valid for selected company
                            </li>
                          </ul>
                        </div>
                        {/* <!-- card-body end --> */}
                        {/* <!-- card-footer end --> */}
                        <div className="card-footer bg-transparent border-0 px-0 py-0">
                          
                            <a className="btn btn-green btn-h-60 text-white rounded-5 btn-block text-uppercase" onClick={()=>handlePaymentOfPlan(SUBSCRIPTION_PLANS_enum.FOREVER)}>
                              Go for Forever Plan
                            </a>
                          
                        </div>
                        {/* <!-- card-footer end --> */}
                      </div>
                      {/* <!-- card end --> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- pricing area function end --> */}
        </div>
      </PageWrapper>
    </>
  );
}
