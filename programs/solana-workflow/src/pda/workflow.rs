use crate::{funcs, BpfWriter};
use anchor_lang::prelude::*;

/***
 * Accounts
 */

#[account]
#[derive(InitSpace)]
pub struct Workflow {
    pub author: Pubkey,
    pub workflow_id: u64,
    pub start: u16,
    #[max_len(50)]
    pub title: String,
    pub no_variable: u8,
}

impl Workflow {
    pub const SEED_PREFIX: &'static [u8; 8] = b"workflow";
    pub fn increase(&mut self) {}
}

// #[account]
#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VoteOption {
    #[max_len(10)]
    pub title: String,
    pub next_id: u16,
}

/// CheckPoint data
/// vote_machine: None if the CheckPoint is the leaf or Pubkey if the CheckPoint is an internal node
/// options: None if the CheckPoint is the leaf or Some if the CheckPoint is an internal node
#[account]
#[derive(InitSpace)]
pub struct CheckPoint {
    pub workflow_id: u64,
    pub id: u16,
    #[max_len(50)]
    pub title: String,
    #[max_len(10)]
    pub options: Option<Vec<VoteOption>>,
    pub vote_machine: Option<Pubkey>,
}

impl CheckPoint {
    pub const SEED_PREFIX: &'static [u8; 10] = b"checkpoint";
    pub const SIZE: usize = 1000;

    fn from<'info>(x: &'info AccountInfo<'info>) -> Account<'info, Self> {
        Account::try_from_unchecked(x).unwrap()
    }

    pub fn serialize(&self, info: AccountInfo) -> Result<()> {
        let dst: &mut [u8] = &mut info.try_borrow_mut_data().unwrap();
        let mut writer: BpfWriter<&mut [u8]> = BpfWriter::new(dst);
        CheckPoint::try_serialize(self, &mut writer)
    }

    pub fn create(
        &mut self,
        workflow_id: u64,
        id: u16,
        title: String,
        options: Option<Vec<VoteOption>>,
        vote_machine: Option<Pubkey>,
    ) -> Result<()> {
        self.workflow_id = workflow_id;
        self.id = id;
        self.title = title;
        self.options = options;
        self.vote_machine = vote_machine;
        Ok(())
    }

    pub fn initialize<'info>(
        payer: AccountInfo<'info>,
        checkpoint: &'info AccountInfo<'info>,
        workflow: AccountInfo<'info>,
        workflow_program: AccountInfo<'info>,
        system_program: AccountInfo<'info>,
        workflow_id: u64,
        id: u16,
        title: String,
        options: Option<Vec<VoteOption>>,
        vote_machine: Option<Pubkey>,
    ) -> Result<()> {
        let binding = workflow.key();
        let seeds: &[&[u8]] = &[&id.to_le_bytes(), b"checkpoint", binding.as_ref()];

        let (_, bump) = Pubkey::find_program_address(seeds, &workflow_program.key());

        funcs::create_account(
            system_program,
            payer.to_account_info(),
            checkpoint.to_account_info(),
            &seeds,
            bump,
            CheckPoint::SIZE,
            &workflow_program.key(),
        )?;

        // deserialize and modify checkpoint account
        let mut run = CheckPoint::from(&checkpoint);
        run.create(workflow_id, id, title, options, vote_machine)?;

        // write
        run.serialize(checkpoint.to_account_info())?;
        Ok(())
    }
}
