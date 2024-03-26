# Solana Workflow @ DASH

## Description

This is DASH, standard for workflow in Solana. Functions:

- create: create a workflow_pda and a list of checkpoint_pda.
- new: create a mission from the starting point of the workflow
  - create mission_pda
  - copy head checkpoint_pda and change its content
- change_variable: change value of a variable of a mission
- move_next_checkpoint: in a mission, from a current checkpoint move to the next

Each vote machine provide:

- vote: make a choice on a mission
  - create new new pda
  - change current checkpoint of misison_pda to the newly created one

## Default votemachine

Dash codebase comes with following default votemachines:

- Document Input: users can change a variable.
- Single Vote: users can choose one option out of several pre-defined ones
- Veto Vote
- Polling

## TODO

- [ ] Votemachine
  - [ ] Solana Program: DocInput, SingleChoice, Squads, Realms
  - [ ] Web2: Discourse
  - [ ] Other chain: Snapshot, Tally
- [ ] Variable
- [ ] Trigger
  - [ ] Web2: Twitter

### Priority

- [ ] DocInput
- [ ] SingleChoice
- [ ] Variable
- [ ] Discourse
- [ ] Squads
- [ ] Twitter
