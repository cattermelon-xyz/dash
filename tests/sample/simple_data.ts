import { PublicKey } from '@solana/web3.js';

import { Workflow, Mission } from '../../clients/js/state';
const workflow: Workflow = {
  title: 'My first workflow',
  start: 1,
  id: 1,
  noVariable: 4,
  checkpoints: [
    {
      id: 1,
      title: '1st check: Do you want to proceed?',
      voteMachineAddress: new PublicKey(
        'D1gMCgf8gHdUNDmpUfe1fHuUQci2JJFCw7CGv184hNMv'
      ),
      options: [
        {
          title: 'Cancel',
          nextId: 3,
        },
        {
          title: 'OK',
          nextId: 2,
        },
      ],
    },
    {
      id: 2,
      title: '2nd check: Do you want to proceed?',
      voteMachineAddress: new PublicKey(
        'D1gMCgf8gHdUNDmpUfe1fHuUQci2JJFCw7CGv184hNMv'
      ),
      options: [
        {
          title: 'Cancel',
          nextId: 3,
        },
        {
          title: 'OK',
          nextId: 4,
        },
      ],
    },
    {
      id: 3,
      title: 'You have cancelled the workflow.',
      voteMachineAddress: new PublicKey(
        'D1gMCgf8gHdUNDmpUfe1fHuUQci2JJFCw7CGv184hNMv'
      ),
      options: [],
    },
    {
      id: 4,
      title: 'Horray, success!',
      voteMachineAddress: new PublicKey(
        'D1gMCgf8gHdUNDmpUfe1fHuUQci2JJFCw7CGv184hNMv'
      ),
      options: [],
    },
  ],
};
const mission: Mission = {
  id: 1,
  workflowId: 1,
  title: 'My first mission',
  content: 'Content of the first misson',
};

export default {
  workflow,
  mission,
};
