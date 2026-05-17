#![no_std]

//! StellarSurprise Escrow Contract
//! Locks USDC gifts until a predetermined unlock timestamp.
//! Sender deposits USDC; recipient can only claim after unlock_at.

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Symbol,
};

const ADMIN: Symbol = symbol_short!("ADMIN");

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum GiftStatus { Locked, Unlocked, Claimed, Cancelled }

#[contracttype]
#[derive(Clone, Debug)]
pub struct Gift {
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
    pub unlock_at: u64,
    pub status: GiftStatus,
    pub created_at: u64,
}

#[contracttype]
pub enum DataKey {
    Gift(u64),
    GiftCount,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    GiftNotFound = 4,
    StillLocked = 5,
    AlreadyClaimed = 6,
    InvalidAmount = 7,
    InvalidUnlockTime = 8,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&ADMIN) { return Err(Error::AlreadyInitialized); }
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&DataKey::GiftCount, &0_u64);
        Ok(())
    }

    /// Lock a gift. Returns the gift ID.
    pub fn lock_gift(
        env: Env,
        sender: Address,
        recipient: Address,
        amount: i128,
        unlock_at: u64,
    ) -> Result<u64, Error> {
        sender.require_auth();
        if !env.storage().instance().has(&ADMIN) { return Err(Error::NotInitialized); }
        if amount <= 0 { return Err(Error::InvalidAmount); }
        if unlock_at <= env.ledger().timestamp() { return Err(Error::InvalidUnlockTime); }

        let id: u64 = env.storage().instance().get(&DataKey::GiftCount).unwrap_or(0);
        env.storage().persistent().set(&DataKey::Gift(id), &Gift {
            sender, recipient, amount, unlock_at,
            status: GiftStatus::Locked,
            created_at: env.ledger().timestamp(),
        });
        env.storage().instance().set(&DataKey::GiftCount, &(id + 1));
        Ok(id)
    }

    /// Claim a gift after unlock_at has passed.
    pub fn claim_gift(env: Env, recipient: Address, gift_id: u64) -> Result<i128, Error> {
        recipient.require_auth();

        let mut gift: Gift = env.storage().persistent()
            .get(&DataKey::Gift(gift_id)).ok_or(Error::GiftNotFound)?;

        if gift.recipient != recipient { return Err(Error::Unauthorized); }
        if gift.status == GiftStatus::Claimed { return Err(Error::AlreadyClaimed); }
        if env.ledger().timestamp() < gift.unlock_at { return Err(Error::StillLocked); }

        gift.status = GiftStatus::Claimed;
        env.storage().persistent().set(&DataKey::Gift(gift_id), &gift.clone());
        Ok(gift.amount)
    }

    /// Cancel a gift (sender only, only if still locked).
    pub fn cancel_gift(env: Env, sender: Address, gift_id: u64) -> Result<(), Error> {
        sender.require_auth();
        let mut gift: Gift = env.storage().persistent()
            .get(&DataKey::Gift(gift_id)).ok_or(Error::GiftNotFound)?;
        if gift.sender != sender { return Err(Error::Unauthorized); }
        if gift.status != GiftStatus::Locked { return Err(Error::AlreadyClaimed); }
        gift.status = GiftStatus::Cancelled;
        env.storage().persistent().set(&DataKey::Gift(gift_id), &gift);
        Ok(())
    }

    pub fn get_gift(env: Env, gift_id: u64) -> Result<Gift, Error> {
        env.storage().persistent().get(&DataKey::Gift(gift_id)).ok_or(Error::GiftNotFound)
    }

    pub fn gift_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::GiftCount).unwrap_or(0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::{Address as _, Ledger}, Env};

    fn setup() -> (Env, EscrowContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        env.ledger().set_timestamp(1_000_000);
        let id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &id);
        let admin = Address::generate(&env);
        client.initialize(&admin).unwrap();
        (env, client, admin)
    }

    #[test]
    fn test_lock_and_claim() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);

        let gift_id = client.lock_gift(&sender, &recipient, &1_000_000, &2_000_000).unwrap();
        assert_eq!(client.get_gift(&gift_id).unwrap().status, GiftStatus::Locked);

        // Advance time past unlock
        env.ledger().set_timestamp(2_000_001);
        let amount = client.claim_gift(&recipient, &gift_id).unwrap();
        assert_eq!(amount, 1_000_000);
        assert_eq!(client.get_gift(&gift_id).unwrap().status, GiftStatus::Claimed);
    }

    #[test]
    fn test_claim_before_unlock_rejected() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        let gift_id = client.lock_gift(&sender, &recipient, &500_000, &2_000_000).unwrap();
        // Still at timestamp 1_000_000 — before unlock
        assert_eq!(client.claim_gift(&recipient, &gift_id), Err(Error::StillLocked));
    }

    #[test]
    fn test_double_claim_rejected() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        let gift_id = client.lock_gift(&sender, &recipient, &500_000, &2_000_000).unwrap();
        env.ledger().set_timestamp(3_000_000);
        client.claim_gift(&recipient, &gift_id).unwrap();
        assert_eq!(client.claim_gift(&recipient, &gift_id), Err(Error::AlreadyClaimed));
    }

    #[test]
    fn test_cancel_gift() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        let gift_id = client.lock_gift(&sender, &recipient, &500_000, &2_000_000).unwrap();
        client.cancel_gift(&sender, &gift_id).unwrap();
        assert_eq!(client.get_gift(&gift_id).unwrap().status, GiftStatus::Cancelled);
    }

    #[test]
    fn test_invalid_amount_rejected() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        assert_eq!(client.lock_gift(&sender, &recipient, &0, &2_000_000), Err(Error::InvalidAmount));
    }

    #[test]
    fn test_past_unlock_rejected() {
        let (env, client, _) = setup();
        let sender = Address::generate(&env);
        let recipient = Address::generate(&env);
        // unlock_at = 500_000 which is before current timestamp 1_000_000
        assert_eq!(client.lock_gift(&sender, &recipient, &100, &500_000), Err(Error::InvalidUnlockTime));
    }
}
