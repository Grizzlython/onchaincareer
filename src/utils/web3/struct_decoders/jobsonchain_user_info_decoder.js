import * as borsh from "@project-serum/borsh";
export const UserCandidateInfoState_SIZE =
  1 +
  32 +
  32 +
  32 +
  256 +
  128 +
  512 +
  64 * 10 +
  10 +
  10 +
  64 +
  32 +
  32 +
  16 +
  1 +
  1 +
  1 +
  1 +
  1 +
  1;
export const ProjectInfoState_SIZE =
  1 + 32 + 1 + 64 + 1024 + 650 + 256 + 660 + 64 + 64 + 32 + 8;
export const ContactInfoState_SIZE =
  1 +
  32 +
  64 +
  16 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128 +
  128;
export const EducationInfoState_SIZE =
  1 +
  32 +
  1 +
  128 +
  64 +
  64 +
  64 +
  64 +
  64 +
  700 +
  700 +
  1024 +
  1 +
  1 +
  650 +
  8;
export const WorkExperienceInfoState_SIZE =
  1 + 32 + 1 + 64 + 128 + 1 + 64 + 64 + 512 + 256 + 128 + 8;
export class UserCandidateInfoState {
  is_initialized; //1
  owner_pubkey; //32
  username; //32
  name; //32
  address; //256
  image_uri; //128
  bio; //512
  skills; //64*10 //640+10+10 ~700;
  designation; //64
  current_employment_status; //32
  can_join_in; //32
  user_type; //16 //recruiter;applicant
  is_company_profile_complete; //1
  is_overview_complete; //1
  is_projects_complete; //1
  is_contact_info_complete; //1
  is_education_complete; //1
  is_work_experience_complete; //1

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.owner_pubkey = data.owner_pubkey;
    this.username = data.username;
    this.name = data.name;
    this.address = data.address;
    this.image_uri = data.image_uri;
    this.bio = data.bio;
    this.skills = data.skills;
    this.designation = data.designation;
    this.current_employment_status = data.current_employment_status;
    this.can_join_in = data.can_join_in;
    this.user_type = data.user_type;
    this.is_company_profile_complete = data.is_company_profile_complete;
    this.is_overview_complete = data.is_overview_complete;
    this.is_projects_complete = data.is_projects_complete;
    this.is_contact_info_complete = data.is_contact_info_complete;
    this.is_education_complete = data.is_education_complete;
    this.is_work_experience_complete = data.is_work_experience_complete;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.publicKey("owner_pubkey"),
    borsh.str("username"),
    borsh.str("name"),
    borsh.str("address"),
    borsh.str("image_uri"),
    borsh.str("bio"),
    borsh.vec(borsh.str(), "skills"),
    borsh.str("designation"),
    borsh.str("current_employment_status"),
    borsh.str("can_join_in"),
    borsh.str("user_type"),
    borsh.bool("is_company_profile_complete"),
    borsh.bool("is_overview_complete"),
    borsh.bool("is_projects_complete"),
    borsh.bool("is_contact_info_complete"),
    borsh.bool("is_education_complete"),
    borsh.bool("is_work_experience_complete"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }

    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new UserCandidateInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in UserCandidateInfoState :", error);
      return null;
    }
  }

  static serializeSaveApplicantInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.str("username"),
      borsh.str("name"),
      borsh.str("address"),
      borsh.str("image_uri"),
      borsh.str("bio"),
      borsh.vec(borsh.str(), "skills"),
      borsh.str("designation"),
      borsh.str("current_employment_status"),
      borsh.str("can_join_in"),
      borsh.str("user_type"),
      borsh.bool("is_company_profile_complete"),
      borsh.bool("is_overview_complete"),
      borsh.bool("is_projects_complete"),
      borsh.bool("is_contact_info_complete"),
      borsh.bool("is_education_complete"),
      borsh.bool("is_work_experience_complete"),
    ]);

    const buffer = Buffer.alloc(UserCandidateInfoState_SIZE);
    const saveApplicantInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveApplicantInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateApplicantInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.str("username"),
      borsh.str("name"),
      borsh.str("address"),
      borsh.str("image_uri"),
      borsh.str("bio"),
      borsh.vec(borsh.str(), "skills"),
      borsh.str("designation"),
      borsh.str("current_employment_status"),
      borsh.str("can_join_in"),
      borsh.str("user_type"),
      borsh.bool("is_company_profile_complete"),
      borsh.bool("is_overview_complete"),
      borsh.bool("is_projects_complete"),
      borsh.bool("is_contact_info_complete"),
      borsh.bool("is_education_complete"),
      borsh.bool("is_work_experience_complete"),
    ]);

    const buffer = Buffer.alloc(UserCandidateInfoState_SIZE);
    const updateApplicantInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode(
      { ...updateApplicantInfoData },
      buffer
    );
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}

export class ProjectInfoState {
  is_initialized; //1
  user_info_state_account_pubkey; //32
  archived; //1
  project_name; //64
  project_description; //1024
  project_image_uris; //128*5 //640+5+5 ~650
  project_link; //256
  project_skills; //64*10 //640+10+10 ~700,
  project_start_date; //64
  project_end_date; //64
  project_status; //32
  project_number; //8

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.user_info_state_account_pubkey = data.user_info_state_account_pubkey;
    this.archived = data.archived;
    this.project_name = data.project_name;
    this.project_description = data.project_description;
    this.project_image_uris = data.project_image_uris;
    this.project_link = data.project_link;
    this.project_skills = data.project_skills;
    this.project_start_date = data.project_start_date
      ? new Date(+data.project_start_date)
      : data.project_start_date;
    this.project_end_date = data.project_end_date
      ? new Date(+data.project_end_date)
      : data.project_end_date;
    this.project_status = data.project_status;
    this.project_number = data.project_number;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.publicKey("user_info_state_account_pubkey"),
    borsh.bool("archived"),
    borsh.str("project_name"),
    borsh.str("project_description"),
    borsh.vec(borsh.str(), "project_image_uris"),
    borsh.str("project_link"),
    borsh.vec(borsh.str(), "project_skills"),
    borsh.str("project_start_date"),
    borsh.str("project_end_date"),
    borsh.str("project_status"),
    borsh.str("project_number"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }
    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new ProjectInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in ProjectInfo State :", error);
      return null;
    }
  }

  static serializeAddProjectInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("project_name"),
      borsh.str("project_description"),
      borsh.vec(borsh.str(), "project_image_uris"),
      borsh.str("project_link"),
      borsh.vec(borsh.str(), "project_skills"),
      borsh.str("project_start_date"),
      borsh.str("project_end_date"),
      borsh.str("project_status"),
      borsh.str("project_number"),
    ]);

    const buffer = Buffer.alloc(ProjectInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateProjectInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("project_name"),
      borsh.str("project_description"),
      borsh.vec(borsh.str(), "project_image_uris"),
      borsh.str("project_link"),
      borsh.vec(borsh.str(), "project_skills"),
      borsh.str("project_start_date"),
      borsh.str("project_end_date"),
      borsh.str("project_status"),
      borsh.str("project_number"),
    ]);

    const buffer = Buffer.alloc(ProjectInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}

export class ContactInfoState {
  is_initialized; //1
  user_info_state_account_pubkey; //32
  email; //64
  phone; //16
  resume_uri; //128
  github; //128
  linkedin; //128
  twitter; //128
  dribble; //128
  behance; //128
  twitch; //128
  solgames; //128
  facebook; //128
  instagram; //128
  website; //128

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.user_info_state_account_pubkey = data.user_info_state_account_pubkey;
    this.email = data.email;
    this.phone = data.phone;
    this.resume_uri = data.resume_uri;
    this.github = data.github;
    this.linkedin = data.linkedin;
    this.twitter = data.twitter;
    this.dribble = data.dribble;
    this.behance = data.behance;
    this.twitch = data.twitch;
    this.solgames = data.solgames;
    this.facebook = data.facebook;
    this.instagram = data.instagram;
    this.website = data.website;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.publicKey("user_info_state_account_pubkey"),
    borsh.str("email"),
    borsh.str("phone"),
    borsh.str("resume_uri"),
    borsh.str("github"),
    borsh.str("linkedin"),
    borsh.str("twitter"),
    borsh.str("dribble"),
    borsh.str("behance"),
    borsh.str("twitch"),
    borsh.str("solgames"),
    borsh.str("facebook"),
    borsh.str("instagram"),
    borsh.str("website"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }

    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new ContactInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in ContactInfoState :", error);
      return null;
    }
  }

  static serializeAddContactInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.str("email"),
      borsh.str("phone"),
      borsh.str("resume_uri"),
      borsh.str("github"),
      borsh.str("linkedin"),
      borsh.str("twitter"),
      borsh.str("dribble"),
      borsh.str("behance"),
      borsh.str("twitch"),
      borsh.str("solgames"),
      borsh.str("facebook"),
      borsh.str("instagram"),
      borsh.str("website"),
    ]);

    const buffer = Buffer.alloc(ContactInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateContactInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.str("email"),
      borsh.str("phone"),
      borsh.str("resume_uri"),
      borsh.str("github"),
      borsh.str("linkedin"),
      borsh.str("twitter"),
      borsh.str("dribble"),
      borsh.str("behance"),
      borsh.str("twitch"),
      borsh.str("solgames"),
      borsh.str("facebook"),
      borsh.str("instagram"),
      borsh.str("website"),
    ]);

    const buffer = Buffer.alloc(ContactInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}

export class EducationInfoState {
  is_initialized; //1
  user_info_state_account_pubkey; //32
  archived; //1
  school_name; //128
  degree; //64
  field_of_study; //64
  start_date; //64
  end_date; //64
  grade; //64
  activities; //64*10 //640+10+10 ~700
  subjects; //64*10 //640+10+10 ~700
  description; //1024
  is_college; //1 //if true then school_name is college name
  is_studying; //1
  certificate_uris; //128*5 //640+5+5 ~650
  education_number; //8

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.user_info_state_account_pubkey = data.user_info_state_account_pubkey;
    this.archived = data.archived;
    this.school_name = data.school_name;
    this.degree = data.degree;
    this.field_of_study = data.field_of_study;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.grade = data.grade;
    this.activities = data.activities;
    this.subjects = data.subjects;
    this.description = data.description;
    this.is_college = data.is_college;
    this.is_studying = data.is_studying;
    this.certificate_uris = data.certificate_uris;
    this.education_number = data.education_number;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.publicKey("user_info_state_account_pubkey"),
    borsh.bool("archived"),
    borsh.str("school_name"),
    borsh.str("degree"),
    borsh.str("field_of_study"),
    borsh.str("start_date"),
    borsh.str("end_date"),
    borsh.str("grade"),
    borsh.vec(borsh.str(), "activities"),
    borsh.vec(borsh.str(), "subjects"),
    borsh.str("description"),
    borsh.bool("is_college"),
    borsh.bool("is_studying"),
    borsh.vec(borsh.str(), "certificate_uris"),
    borsh.str("education_number"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }

    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new EducationInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in EducationInfoState :", error);
      return null;
    }
  }

  static serializeAddEducationInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("school_name"),
      borsh.str("degree"),
      borsh.str("field_of_study"),
      borsh.str("start_date"),
      borsh.str("end_date"),
      borsh.str("grade"),
      borsh.vec(borsh.str(), "activities"),
      borsh.vec(borsh.str(), "subjects"),
      borsh.str("description"),
      borsh.bool("is_college"),
      borsh.bool("is_studying"),
      borsh.vec(borsh.str(), "certificate_uris"),
      borsh.str("education_number"),
    ]);

    const buffer = Buffer.alloc(EducationInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateEducationInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("school_name"),
      borsh.str("degree"),
      borsh.str("field_of_study"),
      borsh.str("start_date"),
      borsh.str("end_date"),
      borsh.str("grade"),
      borsh.vec(borsh.str(), "activities"),
      borsh.vec(borsh.str(), "subjects"),
      borsh.str("description"),
      borsh.bool("is_college"),
      borsh.bool("is_studying"),
      borsh.vec(borsh.str(), "certificate_uris"),
      borsh.str("education_number"),
    ]);

    const buffer = Buffer.alloc(EducationInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}

export class WorkExperienceInfoState {
  is_initialized; //1
  user_info_state_account_pubkey; //32
  archived; //1
  company_name; //64
  designation; //128
  is_currently_working_here; //1
  start_date; //64
  end_date; //64
  description; //512
  location; //256
  website; //128
  work_experience_number; //8

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.user_info_state_account_pubkey = data.user_info_state_account_pubkey;
    this.archived = data.archived;
    this.company_name = data.company_name;
    this.designation = data.designation;
    this.is_currently_working_here = data.is_currently_working_here;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.description = data.description;
    this.location = data.location;
    this.website = data.website;
    this.work_experience_number = data.work_experience_number;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.publicKey("user_info_state_account_pubkey"),
    borsh.bool("archived"),
    borsh.str("company_name"),
    borsh.str("designation"),
    borsh.bool("is_currently_working_here"),
    borsh.str("start_date"),
    borsh.str("end_date"),
    borsh.str("description"),
    borsh.str("location"),
    borsh.str("website"),
    borsh.str("work_experience_number"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }

    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new WorkExperienceInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in WorkExperienceInfoState :", error);
      return null;
    }
  }

  static serializeAddWorkExperienceInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("company_name"),
      borsh.str("designation"),
      borsh.bool("is_currently_working_here"),
      borsh.str("start_date"),
      borsh.str("end_date"),
      borsh.str("description"),
      borsh.str("location"),
      borsh.str("website"),
      borsh.str("work_experience_number"),
    ]);

    const buffer = Buffer.alloc(WorkExperienceInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateWorkExperienceInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("company_name"),
      borsh.str("designation"),
      borsh.bool("is_currently_working_here"),
      borsh.str("start_date"),
      borsh.str("end_date"),
      borsh.str("description"),
      borsh.str("location"),
      borsh.str("website"),
      borsh.str("work_experience_number"),
    ]);

    const buffer = Buffer.alloc(WorkExperienceInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}
