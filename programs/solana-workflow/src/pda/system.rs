use anchor_lang::prelude::*;

#[account]
pub struct System {
    pub authority: Pubkey,
    pub no_org: u32,
}

#[account]
pub struct Treasury {
    pub f_create_workflow: u8,
    pub f_create_mission: u8,
    pub f_vote: u8,
    pub f_finalize: u8,
}
