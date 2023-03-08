import React from "react";
import Link from "next/link";

import hiringImg from "../../assets/image/l1/png/Hiring Manager.png";
import imgM1 from "../../assets/image/l1/png/media-img-1.png";
import imgM2 from "../../assets/image/l1/png/media-img-2.png";
import imgM3 from "../../assets/image/l1/png/media-img-3.png";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Content = () => {
  const router = useRouter();

  const gContext = useContext(GlobalContext);

  const handleCTA = () => {
    if (gContext.user?.user_type === "recruiter") {
      router.push("/dashboard-jobpost");
      return;
    } else {
      if (!gContext.user) {
        toast.error("Please login to post a job");
        gContext.toggleSignInModal();
        return;
      }
      toast.error("You have to be a recruiter to post a job");
    }
  };

  return (
    <>
      {/* <!-- Content Area -->  */}
      <section className="py-13 py-lg-30">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-xl-6 col-lg-5 col-md-10 col-sm-11"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="position-relative pr-lg-20 pr-md-15 pr-9">
                {/* <!-- content img start --> */}
                <img src={hiringImg.src} alt="" className="w-100 rounded-4" />
                {/* <!-- content img end --> */}
                {/* <!-- abs-content start --> */}
               
                {/* <!-- abs-content end --> */}
              </div>
            </div>
            <div
              className="col-lg-6 col-md-9 col-xs-10"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              {/* <!-- content-2 start --> */}
              <div className="content-2 pl-lg-10 pl-0 d-flex flex-column justify-content-center h-100 pt-lg-0 pt-11 pr-md-13 pr-xl-15 pr-xxl-25 pr-0">
                {/* <!-- content-2 section title start --> */}
                
                <h2 className="font-size-9 mb-8">
                  Get applications from the world best talents.
                </h2>
                <ul className="list-unstyled pl-0">
                  <li className="font-weight-semibold border-0 d-flex mb-7 heading-default-color">
                    <i className="fas fa-check font-size-4 text-green mr-6"></i>
                    Connect to the platform using any Solana Wallet (e.g. Phantom, Solflare, Sollet, etc.)
                  </li>
                  <li className="font-weight-semibold border-0 d-flex mb-7 heading-default-color">
                    <i className="fas fa-check font-size-4 text-green mr-6"></i>
                    Create an account as a recruiter
                  </li>
                  <li className="font-weight-semibold border-0 d-flex mb-7 heading-default-color">
                    <i className="fas fa-check font-size-4 text-green mr-6"></i>
                    Create a Company Profile 
                  </li>
                  <li className="font-weight-semibold border-0 d-flex mb-7 heading-default-color">
                    <i className="fas fa-check font-size-4 text-green mr-6"></i>
                    Post a job
                  </li>
                </ul>
                {/* <!-- content-2 section title end --> */}

                <a
                  className="btn btn-green btn-h-60 text-white w-180 rounded-5 text-uppercase"
                  onClick={handleCTA}
                >
                  Post a Job
                </a>
              </div>
              {/* <!-- content-2 end --> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Content;
