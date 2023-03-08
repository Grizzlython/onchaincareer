import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";

export default function Faq() {
  const [openItem, setOpenItem] = useState(1);
  return (
    <>
      <PageWrapper>
        <div className="jobDetails-section bg-default pt-md-30 pt-sm-25 pt-23 pb-md-27 pb-sm-20 pb-17">
          <div className="container">
            <div className="row">
              <div
                className="col-xl-6 col-md-11"
                data-aos="fade-left"
                data-aos-duration="1000"
                style={{
                  marginLeft: "25%",
                }}
              >
                <div className="">
                  <h3 className="font-size-9 font-weight-bold mb-7 mb-lg-13">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="faq-content pt-lg-4 pt-6">
                  <div
                    className="accordion rounded-10 border-green border-top-5 pl-1"
                    id="accordionExample"
                  >
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-1">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(1)}
                          aria-expanded={openItem === 1}
                        >
                          How does the onchaincareer.io work?
                        </button>
                      </div>
                      <Collapse in={openItem === 1}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          It is a decentralized job portal that uses blockchain technology to securely store and manage job postings, applications, and payment transactions, enabling users to interact directly without intermediaries.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-2">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(2)}
                          aria-expanded={openItem === 2}
                        >
                          What are the benefits of using a decentralized job portal?
                        </button>
                      </div>
                      <Collapse in={openItem === 2}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                            <ul>
                              <li>Decentralized control and privacy protection</li>
                              <li>Lower fees and reduced risk of fraud</li>
                              <li>Direct interaction between job seekers and employers</li>
                              <li>Immutable and transparent record of transactions</li>
                            </ul>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-3">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(3)}
                          aria-expanded={openItem === 3}
                        >
                          Boons of using a decentralized job portal?
                        </button>
                      </div>
                      <Collapse in={openItem === 3}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                            <ul>
                              <li>Filtered user base compared to centralized job portals</li>
                              <li>Technical requirements and knowledge makes it ideal for knowledge savy candidates</li>
                              <li>Full autonomy and control on the data </li>
                            </ul>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-4">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(4)}
                          aria-expanded={openItem === 4}
                        >
                          Is the platform secure for sensitive information?
                        </button>
                      </div>
                      <Collapse in={openItem === 4}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          Yes, a decentralized job portal may have its own cryptocurrency or use an existing one to enable secure and transparent payment transactions between job seekers and employers.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-5">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(5)}
                          aria-expanded={openItem === 5}
                        >
                          Is it possible to search for remote jobs on a decentralized job portal?
                        </button>
                      </div>
                      <Collapse in={openItem === 5}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          Yes, a decentralized job portal may offer the ability to search for and apply to remote jobs, as well as on-site positions.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-5">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(6)}
                          aria-expanded={openItem === 6}
                        >
                          Can I apply for jobs from different countries on a decentralized job portal?
                        </button>
                      </div>
                      <Collapse in={openItem === 6}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          Yes, a decentralized job portal may have job listings from various countries and regions, enabling users to apply for and secure employment globally.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-5">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(7)}
                          aria-expanded={openItem === 7}
                        >
                          Are the job postings on a decentralized job portal updated in real-time?
                        </button>
                      </div>
                      <Collapse in={openItem === 7}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          It depends on the specific decentralized job portal, but some platforms may offer real-time updates to job postings and application status.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-5">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(8)}
                          aria-expanded={openItem === 8}
                        >
                          How does a decentralized job portal compare to traditional job portals in terms of job listings and opportunities?
                        </button>
                      </div>
                      <Collapse in={openItem === 8}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          A decentralized job portal may have a smaller user base and job listings compared to traditional, centralized job portals, but it also offers unique opportunities and benefits such as increased security and privacy, lower fees, and direct interaction between job seekers and employers.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                    <div className="border-bottom overflow-hidden">
                      <div className="mb-0 border-bottom-0" id="heading2-5">
                        <button
                          className="btn-reset font-size-5 font-weight-semibold text-left px-0 pb-6 pt-7 accordion-trigger arrow-icon w-100 border-left-0 border-right-0 focus-reset mt-n2"
                          type="button"
                          onClick={() => setOpenItem(9)}
                          aria-expanded={openItem === 9}
                        >
                          Can I connect with other job seekers on the platform?
                        </button>
                      </div>
                      <Collapse in={openItem === 9}>
                        <div className="pr-7">
                          <div className="mt-n3 font-size-4 text-gray font-weight-normal pb-7 pr-7 pt-6">
                          It depends on the specific decentralized job portal, but some platforms may offer community features, such as forums or messaging, to connect and network with other job seekers.
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
