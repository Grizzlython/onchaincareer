import * as borsh from "@project-serum/borsh";
export const JobPostInfoState_SIZE =
  1 +
  1 +
  32 +
  32 +
  8 +
  8 +
  128 +
  256 +
  1024 +
  148 +
  16 +
  8 +
  8 +
  8 +
  8 +
  8 +
  660 +
  512 +
  32 +
  64 +
  64 +
  8;
export class JobPostInfoState {
  is_initialized; //1
  archived; //1
  owner_pubkey; //32
  company_pubkey; //32
  created_at; //8
  updated_at;
  job_created_at; //64
  job_title; //128
  short_description; //256
  long_description; //1024
  category; //32*4+10+10 //category is an array of job category like Frontend Developer
  job_type; //16 full-time, part-time, contract, internship",
  currency_type; //8 fiat, crypto
  currency; //8 USD, ETH, BTC, etc
  min_salary; //8 u64
  max_salary; //8 u64
  experience_in_months; //8 u64
  skills; //64*10+10+10 // ReactJs, NodeJs, etc
  qualification; //512
  job_location_type; //32
  country; //64
  city; //64
  job_number; //8

  constructor(data) {
    this.is_initialized = data.is_initialized;
    this.archived = data.archived;
    this.owner_pubkey = data.owner_pubkey;
    this.company_pubkey = data.company_pubkey;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.job_title = data.job_title;
    this.short_description = data.short_description;
    this.long_description = data.long_description;
    this.category = data.category;
    this.job_type = data.job_type;
    this.currency_type = data.currency_type;
    this.currency = data.currency;
    this.min_salary = data.min_salary;
    this.max_salary = data.max_salary;
    this.experience_in_months = data.experience_in_months;
    this.skills = data.skills;
    this.qualification = data.qualification;
    this.job_location_type = data.job_location_type;
    this.country = data.country;
    this.city = data.city;
    this.job_number = data.job_number;
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.bool("archived"),
    borsh.publicKey("owner_pubkey"),
    borsh.publicKey("company_pubkey"),
    borsh.u64("created_at"),
    borsh.u64("updated_at"),
    borsh.str("job_title"),
    borsh.str("short_description"),
    borsh.str("long_description"),
    borsh.vec(borsh.str(), "category"),
    borsh.str("job_type"),
    borsh.str("currency_type"),
    borsh.str("currency"),
    borsh.u64("min_salary"),
    borsh.u64("max_salary"),
    borsh.u64("experience_in_months"),
    borsh.vec(borsh.str(), "skills"),
    borsh.str("qualification"),
    borsh.str("job_location_type"),
    borsh.str("country"),
    borsh.str("city"),
    borsh.str("job_number"),
  ]);

  static deserialize(buffer /*Buffer*/) {
    if (!buffer) {
      return null;
    }

    try {
      const decodedData = this.borshAccountSchema.decode(buffer);
      return new JobPostInfoState(decodedData);
    } catch (error) {
      console.log("Deserialization error in JobPostInfoState :", error);
      return null;
    }
  }

  static serializeAddJobPostInfoInstruction(updatedObj /*Buffer*/) {
    const saveAccountInstructionSchema = borsh.struct([
      borsh.str("job_title"),
      borsh.str("short_description"),
      borsh.str("long_description"),
      borsh.vec(borsh.str(), "category"),
      borsh.str("job_type"),
      borsh.str("currency_type"),
      borsh.str("currency"),
      borsh.u64("min_salary"),
      borsh.u64("max_salary"),
      borsh.u64("experience_in_months"),
      borsh.vec(borsh.str(), "skills"),
      borsh.str("qualification"),
      borsh.str("job_location_type"),
      borsh.str("country"),
      borsh.str("city"),
      borsh.str("job_number"),
    ]);

    const buffer = Buffer.alloc(JobPostInfoState_SIZE);
    const saveInfoData = {
      ...updatedObj,
    };
    saveAccountInstructionSchema.encode({ ...saveInfoData }, buffer);
    return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer));
  }

  static serializeUpdateJobPostInfoInstruction(updatedObj /*Buffer*/) {
    const updateAccountInstructionSchema = borsh.struct([
      borsh.bool("archived"),
      borsh.str("job_title"),
      borsh.str("short_description"),
      borsh.str("long_description"),
      borsh.vec(borsh.str(), "category"),
      borsh.str("job_type"),
      borsh.str("currency_type"),
      borsh.str("currency"),
      borsh.u64("min_salary"),
      borsh.u64("max_salary"),
      borsh.u64("experience_in_months"),
      borsh.vec(borsh.str(), "skills"),
      borsh.str("qualification"),
      borsh.str("job_location_type"),
      borsh.str("country"),
      borsh.str("city"),
    ]);

    const buffer = Buffer.alloc(JobPostInfoState_SIZE);
    const updateInfoData = {
      ...updatedObj,
    };
    updateAccountInstructionSchema.encode({ ...updateInfoData }, buffer);
    return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer));
  }
}
