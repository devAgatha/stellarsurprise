import { z } from "zod";

export const CreateGiftSchema = z.object({
  senderPhone: z.string().min(10),
  recipientPhone: z.string().min(10),
  amountUsd: z.number().positive(),
  message: z.string().max(500).optional(),
  unlockAt: z.string().datetime(),
  currency: z.enum(["NGN", "USD"]).default("USD"),
});

export type CreateGiftInput = z.infer<typeof CreateGiftSchema>;

export type GiftStatus = "pending" | "funded" | "locked" | "unlocked" | "claimed" | "expired";

export interface Gift {
  id: string;
  senderPhone: string;
  recipientPhone: string;
  amountUsd: number;
  message?: string;
  unlockAt: Date;
  status: GiftStatus;
  stellarTxHash?: string;
  escrowContractId?: string;
  createdAt: Date;
  claimedAt?: Date;
}
