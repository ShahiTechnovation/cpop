use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak::hashv;

declare_id!("Br94deSSULwSGwekP5FsuZqYKfWxBajJmz7t7m5kQusz"); // Replace with your program ID

#[program]
pub mod cpop_merkle {
    use super::*;

    pub fn initialize_event(ctx: Context<InitializeEvent>, merkle_root: [u8; 32]) -> Result<()> {
        ctx.accounts.event.merkle_root = merkle_root;
        ctx.accounts.event.organizer = *ctx.accounts.organizer.key;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, proof: Vec<[u8; 32]>, leaf: [u8; 32]) -> Result<()> {
        let mut computed = leaf;

        for p in proof.iter() {
            computed = if computed <= *p {
                hashv(&[&computed, p]).0
            } else {
                hashv(&[p, &computed]).0
            };
        }

        require!(
            computed == ctx.accounts.event.merkle_root,
            ErrorCode::MerkleProofMismatch
        );

        // Check if already claimed.  Important!
        require!(!ctx.accounts.claim_data.claimed, ErrorCode::AlreadyClaimed);

        ctx.accounts.claim_data.claimed = true;
        ctx.accounts.claim_data.user = *ctx.accounts.user.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEvent<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 32)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(
        init_if_needed, // Use init_if_needed to avoid errors if the account already exists
        payer = user,
        space = 8 + 32 + 1,
        seeds = [b"claim", event.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub claim_data: Account<'info, ClaimData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>, // Add the rent sysvar
}

#[account]
pub struct Event {
    pub merkle_root: [u8; 32],
    pub organizer: Pubkey,
}

#[account]
pub struct ClaimData {
    pub user: Pubkey,
    pub claimed: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Merkle proof mismatch")]
    MerkleProofMismatch,
    #[msg("Already claimed")] // Add a new error code
    AlreadyClaimed,
}
