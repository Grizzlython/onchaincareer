import * as borsh from '@project-serum/borsh'
export const WorkflowInfoState_SIZE = 1 + 1 + 1+ 16 + 32 + 32 + 32 + 32 + 8 + 1 + 8 + 8 + 8;
export class WorkflowInfoState {
    is_initialized; //1
    archived; //1 true when job is in 'accepted' or 'rejected' or 'withdraw' status
    is_saved; //1
    company_owner_pubkey; //32
    company_pubkey; //32
    user_pubkey; //32
    job_pubkey; //32
    status; //16 => 'saved' or 'applied' or 'in_progress' or 'accepted' or 'rejected' or 'withdraw'
    job_applied_at; //8 => timestamp in unix format
    is_paid; //1
    paid_amount;//8
    paid_at; //8 => timestamp in unix format
    last_updated_at; //8 => timestamp in unix format

    constructor(data) {
        this.is_initialized = data.is_initialized;
        this.archived = data.archived;
        this.is_saved = data.is_saved;
        this.company_owner_pubkey = data.company_owner_pubkey;
        this.company_pubkey = data.company_pubkey;
        this.user_pubkey = data.user_pubkey;
        this.job_pubkey = data.job_pubkey;
        this.status = data.status;
        this.job_applied_at = data.job_applied_at;
        this.is_paid = data.is_paid;
        this.paid_amount = data.paid_amount;
        this.paid_at = data.paid_at;
        this.last_updated_at = data.last_updated_at;
        
      }

	static borshAccountSchema = borsh.struct([
        borsh.bool('is_initialized'),
        borsh.bool('archived'),
        borsh.bool('is_saved'),
        borsh.publicKey('company_owner_pubkey'),
        borsh.publicKey('company_pubkey'),
        borsh.publicKey('user_pubkey'),
        borsh.publicKey('job_pubkey'),
        borsh.str('status'),
        borsh.u64('job_applied_at'),
        borsh.bool('is_paid'),
        borsh.u64('paid_amount'),
        borsh.u64('paid_at'),
        borsh.u64('last_updated_at'),
	])

	static deserialize(buffer /*Buffer*/) {
		if (!buffer) {
			return null
		}

		try {
			const decodedData = this.borshAccountSchema.decode(buffer)
			return new WorkflowInfoState(decodedData)
        } catch(error) {
			console.log('Deserialization error in WorkflowInfoState :', error)
			return null
		}
	}

    

    static serializeApplyJobWorkflowInfoInstruction(updatedObj /*Buffer*/) {
		
        const saveAccountInstructionSchema = borsh.struct([
            borsh.str('status'),
            borsh.u64('job_applied_at'),
            borsh.u64('last_updated_at'),
        ])

        const buffer = Buffer.alloc(WorkflowInfoState_SIZE)
        const saveInfoData = {
            ...updatedObj
        }
		saveAccountInstructionSchema.encode({...saveInfoData }, buffer)
		return buffer.slice(0, saveAccountInstructionSchema.getSpan(buffer))
	}

    static serializeUpdateWorkflowInfoInstruction(updatedObj /*Buffer*/) {
		
        const updateAccountInstructionSchema = borsh.struct([
            borsh.bool('archived'),
            borsh.bool('is_saved'),
            borsh.str('status'),
            borsh.u64('last_updated_at'),
        ])

        const buffer = Buffer.alloc(WorkflowInfoState_SIZE)
        const updateInfoData = {
            ...updatedObj
        }
		updateAccountInstructionSchema.encode({...updateInfoData }, buffer)
		return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer))
	}
        static serializeUpdateWorkflowPaymentInfoInstruction(updatedObj /*Buffer*/) {
		
        const updateAccountInstructionSchema = borsh.struct([
            borsh.bool('is_paid'),
            borsh.u64('paid_amount'),
            borsh.u64('paid_at'),
            borsh.u64('last_updated_at'),
        ])

        const buffer = Buffer.alloc(WorkflowInfoState_SIZE)
        const updateInfoData = {
            ...updatedObj
        }
		updateAccountInstructionSchema.encode({...updateInfoData }, buffer)
		return buffer.slice(0, updateAccountInstructionSchema.getSpan(buffer))
	}
}