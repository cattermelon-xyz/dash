use anchor_lang::prelude::*;
use instructions::*;
use states::*;

pub mod instructions;
pub mod states;

declare_id!("3XR9BbkbddGNFCbEG59XXEy9MydHZmGZb6jEq4VxQWY7");

#[program]
pub mod single_choice {
    use super::*;

    pub fn vote<'c: 'info, 'info>(
        ctx: Context<'_, '_, 'c, 'info, Vote<'info>>,
        vote: InputVote,
    ) -> Result<()> {
        instructions::vote::vote(ctx, vote)
    }
}
