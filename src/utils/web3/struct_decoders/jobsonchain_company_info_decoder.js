import * as borsh from '@project-serum/borsh'
export const CompanyInfoState_SIZE = 1 + 1 + 32 + 32 + 64 + 128 + 64 + 8 + 8 + 32 + 8 + 8 + 128 + 128 + 8 + 8 + 512 + 1024 + 128 + 128 + 128 + 128 + 128 + 8;
export class CompanyInfoState {
    is_initialized; //1
    archived; //1
    owner_pubkey; //32
    username; //32
    name; //64
    logo_uri; //128
    domain; //64
    company_type; //8 "product, service, both"
    company_size; //8 "small, medium, large"
    company_stage; //32
    funding_amount; //8
    funding_currency; //8  
    image_uri; //128
    cover_image_uri; //128
    founded_in; //8
    employee_size; //8
    address; //512
    description;// 1024
    website; //128
    linkedin;//128 //"string - max 32 characters",
    twitter; //128 "string - max 32 characters",
    facebook; //128
    instagram; //128
    company_seq_number; //8

    constructor(data) {
        this.is_initialized = data.is_initialized;
        this.archived = data.archived;
        this.owner_pubkey = data.owner_pubkey;
        this.username = data.username;
        this.name = data.name;
        this.logo_uri = data.logo_uri;
        this.domain = data.domain;
        this.company_type = data.company_type;
        this.company_size = data.company_size;
        this.company_stage = data.company_stage;
        this.funding_amount = data.funding_amount;
        this.funding_currency = data.funding_currency;
        this.image_uri = data.image_uri;
        this.cover_image_uri = data.cover_image_uri;
        this.founded_in = data.founded_in;
        this.employee_size = data.employee_size;
        this.address = data.address;
        this.description = data.description;
        this.website = data.website;
        this.linkedin = data.linkedin;
        this.twitter = data.twitter;
        this.facebook = data.facebook;
        this.instagram = data.instagram;
        this.company_seq_number = data.company_seq_number;
      }

	static borshAccountSchema = borsh.struct([
        borsh.bool('is_initialized'),
        borsh.bool('archived'),
        borsh.publicKey('owner_pubkey'),
        borsh.str('username'),
        borsh.str('name'),
        borsh.str('logo_uri'),
        borsh.str('domain'),
        borsh.str('company_type'),
        borsh.str('company_size'),
        borsh.str('company_stage'),
        borsh.str('funding_amount'),
        borsh.str('funding_currency'),
        borsh.str('image_uri'),
        borsh.str('cover_image_uri'),
        borsh.str('founded_in'),
        borsh.u64('employee_size'),
        borsh.str('address'),
        borsh.str('description'),
        borsh.str('website'),
        borsh.str('linkedin'),
        borsh.str('twitter'),
        borsh.str('facebook'),
        borsh.str('instagram'),
        borsh.str('company_seq_number')

	])

	static deserialize(buffer /*Buffer*/) {
		if (!buffer) {
			return null
		}

		try {
			const decodedData = this.borshAccountSchema.decode(buffer)
			return new CompanyInfoState(decodedData)
        } catch(error) {
			console.log('Deserialization error in CompanyInfoState :', error)
			return null
		}
	}

    

    static serializeSaveCompanyInfoInstruction(updatedObj /*Buffer*/) {
		
        const saveAccountInstructionSchema = borsh.struct([
                borsh.str('username'),
                borsh.str('name'),
                borsh.str('logo_uri'),
                borsh.str('domain'),
                borsh.str('company_type'),
                borsh.str('company_size'),
                borsh.str('company_stage'),
                borsh.str('funding_amount'),
                borsh.str('funding_currency'),
                borsh.str('image_uri'),
                borsh.str('cover_image_uri'),
                borsh.str('founded_in'),
                borsh.u64('employee_size'),
                borsh.str('address'),
                borsh.str('description'),
                borsh.str('website'),
                borsh.str('linkedin'),
                borsh.str('twitter'),
                borsh.str('facebook'),
                borsh.str('instagram'),
                borsh.str('company_seq_number')
        ])

        const buffer = Buffer.alloc(CompanyInfoState_SIZE)
        const saveInfoData = {
            ...updatedObj
        }
		saveAccountInstructionSchema.encode({...saveInfoData }, buffer)
		return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer))
	}

    static serializeUpdateCompanyInfoInstruction(updatedObj /*Buffer*/) {
		
        const updateAccountInstructionSchema = borsh.struct([
                borsh.bool('archived'),
                borsh.str('username'),
                borsh.str('name'),
                borsh.str('logo_uri'),
                borsh.str('domain'),
                borsh.str('company_type'),
                borsh.str('company_size'),
                borsh.str('company_stage'),
                borsh.str('funding_amount'),
                borsh.str('funding_currency'),
                borsh.str('image_uri'),
                borsh.str('cover_image_uri'),
                borsh.str('founded_in'),
                borsh.u64('employee_size'),
                borsh.str('address'),
                borsh.str('description'),
                borsh.str('website'),
                borsh.str('linkedin'),
                borsh.str('twitter'),
                borsh.str('facebook'),
                borsh.str('instagram'),
        ])

        const buffer = Buffer.alloc(CompanyInfoState_SIZE)
        const updateInfoData = {
            ...updatedObj
        }
		updateAccountInstructionSchema.encode({...updateInfoData }, buffer)
		return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer))
	}
}