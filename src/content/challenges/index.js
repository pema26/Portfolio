// ============================================================================
//  src/content/challenges/index.js  —  the list of every solved PROBLEM
// ============================================================================
//
//  Same pattern as src/content/projects/index.js: each challenge is a .jsx
//  file with a `meta` named export and a default-exported write-up component.
//
//  HOW TO ADD ONE: copy an existing file in this folder, edit it, then import
//  it below and add one line to the `challenges` array.
// ============================================================================

import CodeforcesHelpfulMaths, { meta as codeforcesHelpfulMathsMeta } from './codeforces-helpful-maths';
import FreecodecampFizzbuzzValidator, { meta as freecodecampFizzbuzzValidatorMeta } from './freecodecamp-fizzbuzz-validator';

export const challenges = [
  { ...codeforcesHelpfulMathsMeta, Content: CodeforcesHelpfulMaths },
  { ...freecodecampFizzbuzzValidatorMeta, Content: FreecodecampFizzbuzzValidator },
];
