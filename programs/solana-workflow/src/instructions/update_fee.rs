use anchor_lang::prelude::*;

use crate::pda::*;

#[derive(Accounts)]
pub struct UpdateFee<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer=user,
        space= 8 + 32 + 32,
        seeds=[b"system"], bump
    )]
    pub system: Account<'info, System>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 1 + 1 + 1 + 1,
        seeds=[b"treasury"],
    )]
    pub treasury: Account<'info, Treasury>,
    pub system_program: Program<'info, System>,
}

pub fn update_fee(
    ctx: Context<UpdateFee>,
    f_create_workflow: u8,
    f_create_mission: u8,
    f_vote: u8,
    f_finalize: u8,
) -> Result<()> {
    if ctx.accounts.system.authority != *ctx.accounts.user.key {
        return Err(ErrorCode::Unauthorized.into());
    }
    let system = &mut ctx.accounts.system;
    system.f_create_workflow = f_create_workflow;
    system.f_create_mission = f_create_mission;
    system.f_vote = f_vote;
    system.f_finalize = f_finalize;

    let treasury = &mut ctx.accounts.treasury;
    treasury.f_create_workflow = f_create_workflow;
    treasury.f_create_mission = f_create_mission;
    treasury.f_vote = f_vote;
    treasury.f_finalize = f_finalize;

    Ok(())
}
