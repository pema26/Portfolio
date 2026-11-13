// ============================================================================
//  src/content/challenges/index.js: the list of every solved PROBLEM
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
import CodeforcesInSearchOfConvenience, { meta as codeforcesInSearchOfConvenienceMeta } from './codeforces-in-search-of-convenience';
import CodeforcesDidNotGoToPrint, { meta as codeforcesDidNotGoToPrintMeta } from './codeforces-did-not-go-to-print';
import CodeforcesMaximizeOneMex, { meta as codeforcesMaximizeOneMexMeta } from './codeforces-maximize-one-mex';
import CodeforcesFrogsJump, { meta as codeforcesFrogsJumpMeta } from './codeforces-frogs-jump';
import Codeforces15k4jr3bEasy, { meta as codeforces15k4jr3bEasyMeta } from './codeforces-15k4jr3b-easy';
import Codeforces15k4jr3bHard, { meta as codeforces15k4jr3bHardMeta } from './codeforces-15k4jr3b-hard';
import CodeforcesNicheInternet, { meta as codeforcesNicheInternetMeta } from './codeforces-niche-internet';
import FreecodecampDigitalDetox, { meta as freecodecampDigitalDetoxMeta } from './freecodecamp-digital-detox';

export const challenges = [
  { ...codeforcesHelpfulMathsMeta, Content: CodeforcesHelpfulMaths },
  { ...freecodecampFizzbuzzValidatorMeta, Content: FreecodecampFizzbuzzValidator },
  { ...codeforcesInSearchOfConvenienceMeta, Content: CodeforcesInSearchOfConvenience },
  { ...codeforcesDidNotGoToPrintMeta, Content: CodeforcesDidNotGoToPrint },
  { ...codeforcesMaximizeOneMexMeta, Content: CodeforcesMaximizeOneMex },
  { ...codeforcesFrogsJumpMeta, Content: CodeforcesFrogsJump },
  { ...codeforces15k4jr3bEasyMeta, Content: Codeforces15k4jr3bEasy },
  { ...codeforces15k4jr3bHardMeta, Content: Codeforces15k4jr3bHard },
  { ...codeforcesNicheInternetMeta, Content: CodeforcesNicheInternet },
  { ...freecodecampDigitalDetoxMeta, Content: FreecodecampDigitalDetox },
];
