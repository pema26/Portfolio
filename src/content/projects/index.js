// ============================================================================
//  src/content/projects/index.js  —  the list of every PROJECT on the site
// ============================================================================
//
//  Each project lives in its own .jsx file in this folder. A project file has
//  two exports:
//    • `meta`            (a named export)  — the facts: title, date, tags, …
//    • the write-up      (the default export) — a React component with the prose
//
//  HOW TO ADD A PROJECT:
//    1. Copy an existing file in this folder and rename it.
//    2. Edit its `meta` object and its write-up.
//    3. Import it below and add one line to the `projects` array.
//
//  Each array item is the project's meta fields plus `Content`, the component
//  that renders its write-up. The pages read this array to build the cards on
//  /projects and the page at /projects/<id>.
// ============================================================================

import Tinyrenderer, { meta as tinyrendererMeta } from './tinyrenderer';
import DataScienceWithR, { meta as dataScienceWithRMeta } from './data-science-with-r';
import YoutubeClone, { meta as youtubeCloneMeta } from './youtube-clone';
import ParcelBoard, { meta as parcelBoardMeta } from './parcel-board';
import VirtualLab, { meta as virtualLabMeta } from './virtual-lab';
import DnaSequenceSorter, { meta as dnaSequenceSorterMeta } from './dna-sequence-sorter';

export const projects = [
  { ...tinyrendererMeta, Content: Tinyrenderer },
  { ...dataScienceWithRMeta, Content: DataScienceWithR },
  { ...youtubeCloneMeta, Content: YoutubeClone },
  { ...parcelBoardMeta, Content: ParcelBoard },
  { ...virtualLabMeta, Content: VirtualLab },
  { ...dnaSequenceSorterMeta, Content: DnaSequenceSorter },
];
