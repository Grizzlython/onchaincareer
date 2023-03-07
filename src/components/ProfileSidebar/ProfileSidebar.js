import React from "react";
import Link from "next/link";

import imgP from "../../assets/image/l3/png/pro-img.png";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";

const Sidebar = (props) => {
  const gContext = useContext(GlobalContext);
  const userName = gContext.user?.username;
  console.log("userName in profileSidebar", userName);
  useEffect(() => {
    gContext.getCandidateProfileByUsername(userName);
    gContext.getCandidateSocials(userName);
  }, [userName]);

  console.log("gContext.user", gContext.user);
  return (
    <>
      {/* <!-- Sidebar Start --> */}

      <div {...props}>
        <div className="pl-lg-5">
          {/* <!-- Top Start --> */}
          <div className="bg-white shadow-9 rounded-4">
            <div className="px-5 py-11 text-center border-bottom border-mercury">
              <Link href="/#">
                <a className="mb-4">
                  <img className="circle-54" src={imgP.src} alt="" />
                </a>
              </Link>
              <h4 className="mb-0">
                <a className="text-black-2 font-size-6 font-weight-semibold">
                  {gContext.candidateProfile[0]?.name}{" "}
                </a>
              </h4>
              <p className="mb-8">
                <a className="text-gray font-size-4">
                  {gContext.candidateProfile[0]?.designation}
                </a>
              </p>

              {props.openView && (
                <p className="mb-8">
                  <a
                    className="text-blue font-size-4"
                    style={{
                      cursor: "pointer",
                    }}
                    // onClick={() => {
                    //   gContext.toggleCandidateSocialsModal();
                    // }}
                  >
                    <i className="fa fa-unlock mr-2"></i>
                    Unlock candidate
                  </a>
                </p>
              )}
              {!props.openView &&
                (gContext.candidateSocials.length === 0 ? (
                  <p className="mb-8">
                    <a
                      className="text-blue font-size-4"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        gContext.toggleCandidateSocialsModal();
                      }}
                    >
                      <i className="fa fa-plus mr-2"></i>
                      Add socials
                    </a>
                  </p>
                ) : (
                  <p className="mb-8">
                    <a
                      className="text-blue font-size-4"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        gContext.toggleCandidateSocialsModal();
                      }}
                    >
                      <i className="fa fa-pen mr-2"></i>
                      Edit socials
                    </a>
                  </p>
                ))}

              {/* <div className="d-flex align-items-center justify-content-center flex-wrap">
                {gContext.user?.isOverviewComplete &&
                gContext.user?.isWorkExperienceComplete &&
                gContext.user?.isProjectsComplete &&
                gContext.user?.isContactInfoComplete ? (
                  <p>
                    Profile completed:{" "}
                    <span className="text-color-default">100%</span>
                  </p>
                ) : gContext.user?.isOverviewComplete &&
                  gContext.user?.isWorkExperienceComplete &&
                  gContext.user?.isProjectsComplete ? (
                  <p>
                    Profile completed:{" "}
                    <span className="text-color-green">75%</span>
                  </p>
                ) : gContext.user?.isOverviewComplete &&
                  gContext.user?.isWorkExperienceComplete ? (
                  <p>
                    Profile completed:{" "}
                    <span className="text-color-default">50%</span>
                  </p>
                ) : gContext.user?.isOverviewComplete ? (
                  <p>
                    Profile completed:{" "}
                    <span className="text-color-default">25%</span>
                  </p>
                ) : (
                  <p>
                    Profile completed:{" "}
                    <span className="text-color-default">0%</span>
                  </p>
                )}
              </div> */}
              <div className="icon-link d-flex align-items-center justify-content-center flex-wrap">
                {gContext.candidateSocials[0]?.github?.length > 0 && (
                  <Link href={gContext.candidateSocials[0]?.github}>
                    <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                      <i className="fab fa-github"></i>
                    </a>
                  </Link>
                )}
                {gContext.candidateSocials[0]?.linkedin?.length > 0 && (
                  <Link href={gContext.candidateSocials[0]?.linkedin}>
                    <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </Link>
                )}

                {gContext.candidateSocials[0]?.twitter?.length > 0 && (
                  <Link href={gContext.candidateSocials[0]?.twitter}>
                    <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </Link>
                )}
                {gContext.candidateSocials[0]?.dribbble?.length > 0 && (
                  <Link href={gContext.candidateSocials[0]?.dribbble}>
                    <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                      <i className="fab fa-dribbble"></i>
                    </a>
                  </Link>
                )}
                {gContext.candidateSocials[0]?.behance?.length > 0 && (
                  <Link href={gContext.candidateSocials[0]?.behance}>
                    <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                      <i className="fab fa-behance"></i>
                    </a>
                  </Link>
                )}
              </div>
            </div>
            {/* <!-- Top End --> */}
            {/* <!-- Bottom Start --> */}
            <div className="px-9 pt-lg-5 pt-9 pt-xl-9 pb-5">
              <h5 className="text-black-2 mb-8 font-size-5">Contact Info</h5>
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Location</p>
                <h5 className="font-size-4 font-weight-semibold mb-0 text-black-2 text-break">
                  <i class="fa fa-location-arrow mr-2"></i>
                  {gContext.candidateProfile[0]?.location}
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">E-mail</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  <a
                    className="text-black-2 text-break"
                    href={`mailto:${gContext.candidateSocials[0]?.email}`}
                  >
                    {props.openView ? (
                      <>
                        <i className="fa fa-lock mr-2"></i>
                        Locked
                      </>
                    ) : (
                      <>
                        <i className="fa fa-envelope mr-2"></i>
                        {gContext.candidateSocials[0]?.email}
                      </>
                    )}
                  </a>
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Phone</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  <a className="text-black-2 text-break" href="tel:+999565562">
                    {props.openView ? (
                      <>
                        <i className="fa fa-lock mr-2"></i>
                        Locked
                      </>
                    ) : (
                      <>
                        <i className="fa fa-phone mr-2"></i>
                        {gContext.candidateSocials[0]?.phone}
                      </>
                    )}
                  </a>
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Website Linked</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  {props.openView ? (
                    <a className="text-break">
                      <i className="fa fa-lock mr-2"></i>
                      Locked
                    </a>
                  ) : !gContext.candidateSocials[0]?.website?.length > 0 ? (
                    <Link href="/">
                      <a className="text-break">
                        <i className="fa fa-link mr-2"></i>
                        NA
                      </a>
                    </Link>
                  ) : (
                    <Link href={gContext.candidateSocials[0]?.website}>
                      <a className="text-break">
                        <i className="fa fa-link mr-2"></i>
                        {gContext.candidateSocials[0]?.website}
                      </a>
                    </Link>
                  )}
                </h5>
              </div>
              {/* <!-- Single List --> */}
            </div>
            {/* <!-- Bottom End --> */}
          </div>
        </div>
      </div>

      {/* <!-- Sidebar End --> */}
    </>
  );
};

export default Sidebar;
