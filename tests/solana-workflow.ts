import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { SolanaWorkflow } from '../target/types/solana_workflow';
import { SingleChoice } from '../target/types/single_choice';
import { DocInput } from '../target/types/doc_input';

import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';
import axios from 'axios';
import sdk from '../clients/js/index';

type InputCheckpoint = anchor.IdlTypes<SolanaWorkflow>['InputCheckPoint'];
type InputVote = anchor.IdlTypes<DocInput>['InputVote'];

import sampleData from './sample/simple_data';

describe('solana-workflow', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const solanaWorkflow = anchor.workspace
    .SolanaWorkflow as Program<SolanaWorkflow>;
  const docInput = anchor.workspace.DocInput as Program<DocInput>;
  const anchorProvider = solanaWorkflow.provider as anchor.AnchorProvider;

  it('Create workflow', async () => {
    const sampledata = sampleData.workflow;
    const pdaInfo = await sdk.create_workflow({
      workflow: sampledata,
      skipPreflight: true,
      user: anchorProvider.wallet.publicKey,
      debug: true,
    });
    console.log('workflow pda: ', pdaInfo);
  });

  it('Create mission', async () => {
    const sampledata = sampleData.mission;
    const pdaInfo = await sdk.create_mission({
      mission: sampledata,
      skipPreflight: true,
      user: anchorProvider.wallet.publicKey,
      debug: true,
    });
    console.log('mission pda: ', pdaInfo);
  });

  // it('Vote', async () => {
  //   const [missionPDA, _] = PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from('mission'),
  //       anchorProvider.wallet.publicKey.toBuffer(),
  //       Buffer.from(borsh.serialize('u64', 1)),
  //     ],
  //     solanaWorkflow.programId
  //   );

  //   const currentVoteData = (
  //     await solanaWorkflow.account.mission.fetch(missionPDA)
  //   ).currentVoteData;

  //   const checkpointId = (
  //     await solanaWorkflow.account.voteData.fetch(currentVoteData)
  //   ).checkpointId;

  //   const checkpointData = simpleWorkflow.checkpoints.find(
  //     (cp: InputCheckpoint) => cp.id === checkpointId
  //   );

  //   const [workflowPDA, __] = PublicKey.findProgramAddressSync(
  //     [Buffer.from('workflow'), anchorProvider.wallet.publicKey.toBuffer()],
  //     solanaWorkflow.programId
  //   );

  //   const [checkpointPDA, ___] = PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from(borsh.serialize('u16', checkpointId)),
  //       Buffer.from('checkpoint'),
  //       workflowPDA.toBuffer(),
  //     ],
  //     solanaWorkflow.programId
  //   );

  //   let remainingAccounts = [];

  //   let coefs = [];
  //   for (let option of checkpointData.options) {
  //     let coef = 0;
  //     let isExist = false;

  //     const [nextCheckpointPDA, ___] = PublicKey.findProgramAddressSync(
  //       [
  //         Buffer.from(borsh.serialize('u16', option.nextId)),
  //         Buffer.from('checkpoint'),
  //         workflowPDA.toBuffer(),
  //       ],
  //       solanaWorkflow.programId
  //     );

  //     remainingAccounts.push({
  //       pubkey: nextCheckpointPDA,
  //       isWritable: false,
  //       isSigner: false,
  //     });
  //     while (isExist === false || coef === 8) {
  //       const [nextVoteData, __] = PublicKey.findProgramAddressSync(
  //         [
  //           Buffer.from('vote_data'),
  //           missionPDA.toBuffer(),
  //           Buffer.from(borsh.serialize('u16', option.nextId)),
  //           Buffer.from([coef]),
  //         ],
  //         solanaWorkflow.programId
  //       );

  //       const url = 'http://localhost:8899';
  //       const data = {
  //         jsonrpc: '2.0',
  //         id: 1,
  //         method: 'getAccountInfo',
  //         params: [
  //           nextVoteData,
  //           {
  //             encoding: 'base58',
  //           },
  //         ],
  //       };

  //       try {
  //         const response = await axios.post(url, data, {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         });

  //         if (!response.data.result.value) {
  //           isExist = true;
  //           remainingAccounts.push({
  //             pubkey: nextVoteData,
  //             isWritable: true,
  //             isSigner: false,
  //           });
  //           coefs.push(coef);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }

  //       coef++;
  //     }
  //   }

  //   const [variable, bump] = PublicKey.findProgramAddressSync(
  //     [Buffer.from('variable'), missionPDA.toBuffer(), Buffer.from([1])],
  //     solanaWorkflow.programId
  //   );
  //   remainingAccounts.push({
  //     pubkey: variable,
  //     isWritable: true,
  //     isSigner: false,
  //   });

  //   console.log(coefs, remainingAccounts);

  //   const vote: InputVote = {
  //     option: 0,
  //     submission: Buffer.from('This is for you'),
  //   };

  //   const tx = await docInput.methods
  //     .vote(vote, Buffer.from(coefs))
  //     .accounts({
  //       user: anchorProvider.wallet.publicKey,
  //       mission: missionPDA,
  //       voteData: currentVoteData,
  //       checkpoint: checkpointPDA,
  //       dash: solanaWorkflow.programId,
  //     })
  //     .remainingAccounts(remainingAccounts)
  //     .rpc({ skipPreflight: true });

  //   console.log(tx);
  // });
});
