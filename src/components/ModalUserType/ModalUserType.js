import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import GlobalContext from "../../context/GlobalContext";
import { add_applicant_info } from "../../utils/web3/web3_functions";
import { toast } from "react-toastify";

const ModalStyled = styled(Modal)`
  /* &.modal {
    z-index: 10050;
  } */
`;

const ModalUserType = (props) => {
  const [userType, setUserType] = useState("");

  const gContext = useContext(GlobalContext);

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  // const handleClose = () => {
  //   gContext.toggleUserTypeModal();
  // };

  const handleSubmitUserType = async () => {
    try {
      if (!publicKey) {
        return;
      }
      const applicantInfo = {
        username: publicKey.toString(),
        name: "",
        address: "",
        image_uri: "",
        bio: "",
        skills: [],
        designation: "",
        current_employment_status: "",
        can_join_in: "",
        user_type: userType,
        is_company_profile_complete: false,
        is_overview_complete: false,
        is_projects_complete: false,
        is_contact_info_complete: false,
        is_education_complete: false,
        is_work_experience_complete: false,
      };

      const addUserRes = await add_applicant_info(
        publicKey,
        applicantInfo,
        connection,
        signTransaction
      );

      if (addUserRes) {
        toast.success("User added successfully");
        gContext.toggleUserTypeModal();
        if (userType === "applicant") {
          await gContext.toggleCandidateProfileModal();
        } else {
          await gContext.toggleCompanyProfileModal();
        }
      } else {
        toast.error("User not added");
        gContext.toggleUserTypeModal();
      }
    } catch (err) {
      console.log(err.message, "err--")
      toast.error(err.message);
      gContext.toggleUserTypeModal();
    }
  };

  return (
    <ModalStyled
      {...props}
      size="lg"
      centered
      show={gContext.userTypeModalVisible}
      onHide={gContext.toggleUserTypeModal}
    >
      <Modal.Body className="p-0">
        <div
          className="login-modal-main bg-white rounded-8 overflow-hidden"
          style={{
            padding: "20px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
            }}
          >
            Are you a recruiter ?
          </h3>
          <div
            style={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div>
                <input
                  type={"radio"}
                  name="recruiter"
                  id="recruiter"
                  // value={"recruiter"}
                  onChange={(e) => setUserType("recruiter")}
                  style={{
                    marginRight: "10px",
                  }}
                />
                <label
                  htmlFor="recruiter"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Yes
                </label>
              </div>
              <div>
                <input
                  type={"radio"}
                  name="recruiter"
                  id="applicant"
                  // value={"applicant"}
                  onChange={(e) => setUserType("applicant")}
                  style={{
                    marginRight: "10px",
                  }}
                />
                <label
                  htmlFor="applicant"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  No
                </label>
              </div>
            </div>
            {/* <button> */}
            <a
              className="btn btn-green btn-h-40 text-white w-120 rounded-5 text-uppercase"
              onClick={handleSubmitUserType}
            >
              Create Account
            </a>
          </div>
        </div>
      </Modal.Body>
    </ModalStyled>
  );
};

export default ModalUserType;
