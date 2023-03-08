import React from "react";
import Link from "next/link";

import imgP from "../../assets/image/l3/png/pro-img.png";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const RecruiterSidebar = (props) => {
  const gContext = useContext(GlobalContext);
  const {
    candidateSocials,
    fetchAndSetCandidateSocials,
    isPremiumCompanyOwner,
  } = gContext;
  const { publicKey, wallet, connected } = useWallet();
  const { connection } = useConnection();

  const [candidateProfile, setCandidateProfile] = React.useState({});
  const [candidateSocialsContext, setCandidateSocialsContext] = React.useState(null);
  const { recruiterInfo } = props;

  // useEffect(() => {
  //   if (!userName) return;

  //   const applicant_info_state_account = new PublicKey(userName);

  //   (async () => {
  //     gContext.getCandidateProfileByUsername(
  //       applicant_info_state_account,
  //       connection
  //     );
  //   })();
  // }, [userName]);
  // useEffect(() => {
  //   if (!publicKey) {
  //     router.push("/");
  //     return;
  //   }

  //   (async () => {
  //     await gContext.fetchAndSetCandidateSocials(publicKey, connection);
  //   })();
  // }, [publicKey]);

  // console.log("gContext.user", gContext.user);

  useEffect(() => {
    if (!recruiterInfo) return;
    (async () => {
      setCandidateProfile(recruiterInfo);
        await fetchAndSetCandidateSocials(
          publicKey,
          connection,
          recruiterInfo.pubkey
        );
    })();
  }, [recruiterInfo]);


  useEffect(() => {
    if (!candidateSocials) {
      setCandidateSocialsContext(null);
      return;
    }
    console.log(candidateSocials, "candidateSocials");
    setCandidateSocialsContext(candidateSocials);
  }, [candidateSocials]);

  return (
    <>
      {/* <!-- Sidebar Start --> */}

      <div {...props}>
        <div className="pl-lg-5">
          {/* <!-- Top Start --> */}
          <div className="bg-white shadow-9 rounded-4">
            <div className="py-11 text-center border-bottom border-mercury">
              {/* <Link href="/#"> */}
              <a className="">
                <img
                  className="circle-54"
                  src={
                    candidateProfile &&
                    candidateProfile.image_uri &&
                    candidateProfile.image_uri.length > 0
                      ? candidateProfile.image_uri
                      : imgP.src
                  }
                  alt=""
                />
              </a>
              {/* </Link> */}
              <h4 className="mb-0">
                <a className="text-black-2 font-size-6 font-weight-semibold">
                  {candidateProfile && candidateProfile.name}
                </a>
              </h4>
              <p className="mb-8">
                <a className="text-gray font-size-4">
                  {candidateProfile?.designation}
                </a>
              </p>

              
              {
                (!candidateSocialsContext ? (
                  <p className="mb-8">
                    <a
                      className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
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
                      className="btn btn-outline-green text-uppercase w-180 h-px-48 rounded-5 mr-7 mb-7"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        gContext.toggleCandidateSocialsModal();
                      }}
                    >
                      <i className="fa fa-pen mr-2"></i>
                      Update socials
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
              {candidateSocialsContext && (
                <div className="icon-link d-flex align-items-center justify-content-center flex-wrap">
                  {candidateSocialsContext?.github?.length > 0 && (
                    <Link href={candidateSocialsContext?.github}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-github"></i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.linkedin?.length > 0 && (
                    <Link href={candidateSocialsContext?.linkedin}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </Link>
                  )}

                  {candidateSocialsContext?.twitter?.length > 0 && (
                    <Link href={candidateSocialsContext?.twitter}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.dribbble?.length > 0 && (
                    <Link href={candidateSocialsContext?.dribbble}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-dribbble"></i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.behance?.length > 0 && (
                    <Link href={candidateSocialsContext?.behance}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-behance"></i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.facebook?.length > 0 && (
                    <Link href={candidateSocialsContext?.facebook}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-facebook"> </i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.solgames?.length > 0 && (
                    <Link href={candidateSocialsContext?.solgames}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-facebook"> </i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.twitch?.length > 0 && (
                    <Link href={candidateSocialsContext?.twitch}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-twitch"> </i>
                      </a>
                    </Link>
                  )}
                  {candidateSocialsContext?.instagram?.length > 0 && (
                    <Link href={candidateSocialsContext?.instagram}>
                      <a className="text-smoke circle-32 bg-concrete mr-5 hover-bg-green">
                        <i className="fab fa-instagram"> </i>
                      </a>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* <!-- Top End --> */}
            {/* <!-- Bottom Start --> */}
            <div className="px-9 pt-lg-5 pt-9 pt-xl-9 pb-5">
              <h5 className="text-black-2 mb-8 font-size-5">Contact Info</h5>
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Location</p>
                <h5 className="font-size-4 font-weight-semibold mb-0 text-black-2 text-break">
                    <>
                      <i className="fa fa-location-arrow mr-2"></i>{" "}
                      {candidateProfile?.address}
                    </>
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">E-mail</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  <a className="text-black-2 text-break" href={"/"}>
                        <i className="fa fa-envelope mr-2"></i>
                        {candidateSocialsContext &&
                          candidateSocialsContext?.email}
                  </a>
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Phone</p>
                <h5 className="font-size-4 font-weight-semibold mb-0">
                  <a className="text-black-2 text-break" href="tel:+999565562">
                      {candidateSocialsContext && (
                        <>
                          <i className="fa fa-phone mr-2"></i>
                          {candidateSocialsContext &&
                            candidateSocialsContext?.phone}
                        </>
                      
                    )}
                  </a>
                </h5>
              </div>
              {/* <!-- Single List --> */}
              {/* <!-- Single List --> */}
              <div className="mb-7">
                <p className="font-size-4 mb-0">Website Linked</p>
                <h5 className=" font-size-4 font-weight-semibold mb-0">
                    <Link href={"/"}>
                      <a className="text-break">
                        <i className="fa fa-link mr-2"></i>
                        {candidateSocialsContext?.website}
                      </a>
                    </Link>
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

export default RecruiterSidebar;
