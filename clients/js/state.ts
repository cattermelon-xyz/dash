import * as anchor from '@coral-xyz/anchor';
import { SolanaWorkflow } from '../../target/types/solana_workflow';
type InputCheckpoint = anchor.IdlTypes<SolanaWorkflow>['InputCheckPoint'];

export type Workflow = {
  id: number;
  title: string;
  start: number;
  checkpoints: Array<InputCheckpoint>;
  noVariable: number;
};

export type Mission = {
  id: number;
  workflowId: number;
  title: string;
  content: string;
};
