import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { SolanaWorkflow } from '../target/types/solana_workflow';
import { SingleChoice } from '../target/types/single_choice';
import { DocInput } from '../target/types/doc_input';

import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';
import axios from 'axios';
import sdk from '../clients/js/index';

describe('system testing', () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const pg = anchor.workspace.SolanaWorkflow as Program<SolanaWorkflow>;
  it('Can set authority', async () => {});
});
