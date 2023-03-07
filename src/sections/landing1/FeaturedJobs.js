import React, { useContext, useEffect } from "react";
import Link from "next/link";
import imgF1 from "../../assets/image/l1/png/feature-brand-1.png";
import imgF2 from "../../assets/image/l1/png/feature-brand-2.png";
import imgF3 from "../../assets/image/l1/png/feature-brand-3.png";
import imgF4 from "../../assets/image/l1/png/feature-brand-4.png";
import imgF5 from "../../assets/image/l1/png/feature-brand-5.png";
import imgF6 from "../../assets/image/l1/png/feature-brand-6.png";

import GlobalContext from "../../context/GlobalContext";
import { toast } from "react-toastify";

const FeaturedJobs = () => {
  const gContext = useContext(GlobalContext);

  useEffect(() => {
    gContext.getJobListings({
      limit: 6,
    });
  }, []);

  const applyForJob = (jobListingId, companyName) => {
    const payload = {
      username: gContext.user?.username,
      candidateId: gContext.candidateProfile[0]?.id,
      jobListingId: jobListingId,
      companyName: companyName,
      status: "PENDING",
    };
    if (!gContext.user) {
      gContext.toggleSignInModal();
      toast.error("⚠️ Please sign in to apply for a job");
    }

    console.log(gContext.user, "user");

    if (gContext.user && gContext.user?.isProfileComplete === true) {
      gContext.addJobApplication(payload);
    } else {
      toast.error("⚠️ Please complete your profile to apply for a job");
      //TODO: navigate to user profile page
    }
  };

  return (
    <>
      {/* <!-- FeaturedJobs Area -->  */}
      <div className="pt-11 pt-lg-27 pb-7 pb-lg-26 bg-black-2 dark-mode-texts">
        <div className="container">
          {/* <!-- Section Top --> */}
          <div className="row align-items-center pb-14">
            {/* <!-- Section Title --> */}
            <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-left mb-13 mb-lg-0">
                <h2 className="font-size-9 font-weight-bold">Featured Jobs</h2>
              </div>
            </div>
            {/* <!-- Section Button --> */}
            <div className="col-12 col-xl-6 col-lg-6">
              <div className="text-center text-lg-right">
                <Link href="/search-jobs">
                  <a className="btn btn-outline-white text-uppercase">
                    Explore All
                  </a>
                </Link>
              </div>
            </div>
            {/* <!-- Section Button End --> */}
          </div>
          {/* <!-- End Section Top --> */}

          <div className="row justify-content-center">
            {gContext.jobListings.length > 0 &&
              gContext.jobListings.map((jobListing) => (
                <div
                  className="col-12 col-lg-4 col-md-6 px-xxl-7"
                  data-aos="fade-up"
                  data-aos-duration="800"
                >
                  {/* <!-- Start Feature One --> */}
                  <div className="bg-white px-8 pt-9 pb-7 rounded-4 mb-9 feature-cardOne-adjustments">
                    <div className="d-block mb-7">
                      <Link href="/#">
                        <a>
                          <img
                            src={jobListing.logo}
                            alt=""
                            style={{
                              width: "75px",
                              height: "75px",
                            }}
                          />
                        </a>
                      </Link>
                    </div>
                    <Link href={`/company/${jobListing.companyName}`}>
                      <a className="font-size-3 d-block mb-0 text-gray">
                        {jobListing.companyName.toUpperCase()}
                      </a>
                    </Link>
                    <h2 className="mt-n4">
                      {/* <Link href="/#"> */}
                      <a className="font-size-7 text-black-2 font-weight-bold mb-4">
                        {jobListing.title}
                      </a>
                      {/* </Link> */}
                    </h2>
                    <ul className="list-unstyled mb-1 card-tag-list">
                      <li>
                        {/* <Link href="/#"> */}
                        <a className="bg-regent-opacity-15 text-denim font-size-3 rounded-3">
                          <i className="icon icon-pin-3 mr-2 font-weight-bold"></i>{" "}
                          {jobListing.jobLocationType === "remote"
                            ? "Remote"
                            : `${jobListing.city}, ${jobListing.country}`}
                        </a>
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link href="/#"> */}
                        <a className="bg-regent-opacity-15 text-orange font-size-3 rounded-3">
                          <i className="fa fa-briefcase mr-2 font-weight-bold"></i>{" "}
                          {jobListing.jobType}
                        </a>
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link href="/#"> */}
                        <a className="bg-regent-opacity-15 text-eastern font-size-3 rounded-3">
                          <i className="fa fa-rupee-sign mr-2 font-weight-bold"></i>{" "}
                          {jobListing.salaryRange}
                        </a>
                        {/* </Link> */}
                      </li>
                    </ul>
                    <p className="mb-7 font-size-4 text-gray">
                      {jobListing.shortDescription}
                    </p>
                    <div className="card-btn-group">
                      <Link href={`/job-details/${jobListing.id}`}>
                        <a className="btn btn-green text-uppercase btn-medium rounded-3">
                          View Job
                        </a>
                      </Link>
                    </div>
                  </div>

                  {/* <!-- End Feature One --> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedJobs;
