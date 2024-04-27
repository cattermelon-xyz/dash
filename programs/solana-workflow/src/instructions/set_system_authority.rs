use anchor_lang::prelude::*;

use crate::pda::*;

#[derive(Accounts)]
pub struct SetSystemAuthority<'info> {
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer=user,
        space= 8 + 32 + 32,
        seeds=[b"system"], bump
    )]
    pub system: Account<'info, System>,
    pub system_program: Program<'info, System>,
}

pub fn set_system_authority(ctx: Context<SetSystemAuthority>, authority: Pubkey) -> Result<()> {
    if ctx.accounts.system.authority == Pubkey::default()
        || ctx.accounts.system.authority == *ctx.accounts.user.key
    {
        let system = &mut ctx.accounts.system;
        system.authority = authority;
    } else {
        return Err(ErrorCode::Unauthorized.into());
    }

    Ok(())
}
