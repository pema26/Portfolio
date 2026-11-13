// ============================================================================
//  src/content/research/index.js: the list of every RESEARCH write-up
// ============================================================================
//
//  Same pattern as src/content/projects/index.js: each entry is a .jsx file
//  with a `meta` named export and a default-exported write-up component.
//
//  HOW TO ADD ONE: copy an existing file in this folder, edit it, then import
//  it below and add one line to the `research` array.
// ============================================================================

import KinaseInhibitors, { meta as kinaseInhibitorsMeta } from './kinase-inhibitors';
import SiteDirectedMutagenesis, { meta as siteDirectedMutagenesisMeta } from './site-directed-mutagenesis';

export const research = [
  { ...kinaseInhibitorsMeta, Content: KinaseInhibitors },
  { ...siteDirectedMutagenesisMeta, Content: SiteDirectedMutagenesis },
];
