import { SolanaWorkflow } from '../../target/types/solana_workflow';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { Workflow, Mission } from './state';
import * as borsh from 'borsh';

const dashSdk = {
  create_workflow: async function ({
    workflow,
    skipPreflight = false,
    user,
    debug = false,
  }: {
    workflow: Workflow;
    skipPreflight?: boolean;
    user: PublicKey;
    debug?: boolean;
  }) {
    const pg = anchor.workspace.SolanaWorkflow as Program<SolanaWorkflow>;
    const anchorProvider = pg.provider as anchor.AnchorProvider;
    const [workflowPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('workflow'), anchorProvider.wallet.publicKey.toBuffer()],
      pg.programId
    );

    let remainingAccounts: any[] = [];
    for (let i = 0; i < workflow.checkpoints.length; i++) {
      const [checkpointPDA, bump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(borsh.serialize('u16', workflow.checkpoints[i].id)),
          Buffer.from('checkpoint'),
          workflowPDA.toBuffer(),
        ],
        pg.programId
      );

      remainingAccounts.push({
        pubkey: checkpointPDA,
        isWritable: true,
        isSigner: false,
      });
    }

    const tx = await pg.methods
      .createWorkflow(
        workflow.title,
        workflow.start,
        new anchor.BN(workflow.id),
        workflow.checkpoints
      )
      .accounts({
        user,
        workflow: workflowPDA,
        workflowProgram: pg.programId,
      })
      .remainingAccounts(remainingAccounts)
      .rpc({ skipPreflight });
    if (debug) {
      console.log('Create workflow tx: ', tx);
    }
    try {
      const workflowInfo = pg.account.workflow.fetch(workflowPDA);
      return workflowInfo;
    } catch (e) {
      return null;
    }
  },

  create_mission: async function ({
    mission,
    user,
    skipPreflight = false,
    debug = false,
  }: {
    mission: Mission;
    user: PublicKey;
    skipPreflight?: boolean;
    debug?: boolean;
  }) {
    const pg = anchor.workspace.SolanaWorkflow as Program<SolanaWorkflow>;
    const anchorProvider = pg.provider as anchor.AnchorProvider;
    const [missionPDA, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('mission'),
        user.toBuffer(),
        Buffer.from(borsh.serialize('u64', 1)), // TODO: why 1?
      ],
      pg.programId
    );

    const [voteData, __] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('vote_data'),
        missionPDA.toBytes(),
        Buffer.from(borsh.serialize('u64', 1)),
        Buffer.from([0]),
      ],
      pg.programId
    );

    const tx = await pg.methods
      .createMission(
        new anchor.BN(mission.workflowId),
        new anchor.BN(mission.id),
        mission.title,
        mission.content,
        voteData,
        // this is create mission function, it should know figure out the id itself
        1, // TODO: this does not make sense!
        new anchor.BN(1) // TODO: this does not make sense
      )
      .accounts({
        user,
        mission: missionPDA,
        voteData: voteData,
      })
      .rpc({ skipPreflight });
    if (debug) {
      console.log('Create misison txn: ', tx);
    }
    try {
      const missionInfo = pg.account.mission.fetch(missionPDA);
      return missionInfo;
    } catch (e) {
      return null;
    }
  },
};

export default dashSdk;
