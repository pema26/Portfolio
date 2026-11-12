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

import PaymentReview, { meta as paymentReviewMeta } from './payment-review';
import DataScienceWithR, { meta as dataScienceWithRMeta } from './data-science-with-r';
import YoutubeClone, { meta as youtubeCloneMeta } from './youtube-clone';
import ParcelBoard, { meta as parcelBoardMeta } from './parcel-board';
import VirtualLab, { meta as virtualLabMeta } from './virtual-lab';
import DnaSequenceSorter, { meta as dnaSequenceSorterMeta } from './dna-sequence-sorter';
import WordleAssistant, { meta as wordleAssistantMeta } from './wordle-assistant';
import FridgeTracker, { meta as fridgeTrackerMeta } from './fridge-tracker';
import TextEditorInC, { meta as textEditorInCMeta } from './text-editor-in-c';
import FastaAnalyzer, { meta as fastaAnalyzerMeta } from './fasta-analyzer';
import GeneExpressionPipeline, { meta as geneExpressionPipelineMeta } from './gene-expression-pipeline';
import DigitalDetoxCli, { meta as digitalDetoxCliMeta } from './digital-detox-cli';
import BiologicalDatabase, { meta as biologicalDatabaseMeta } from './biological-database';

export const projects = [
  { ...paymentReviewMeta, Content: PaymentReview },
  { ...dataScienceWithRMeta, Content: DataScienceWithR },
  { ...youtubeCloneMeta, Content: YoutubeClone },
  { ...parcelBoardMeta, Content: ParcelBoard },
  { ...virtualLabMeta, Content: VirtualLab },
  { ...dnaSequenceSorterMeta, Content: DnaSequenceSorter },
  { ...wordleAssistantMeta, Content: WordleAssistant },
  { ...fridgeTrackerMeta, Content: FridgeTracker },
  { ...textEditorInCMeta, Content: TextEditorInC },
  { ...fastaAnalyzerMeta, Content: FastaAnalyzer },
  { ...geneExpressionPipelineMeta, Content: GeneExpressionPipeline },
  { ...digitalDetoxCliMeta, Content: DigitalDetoxCli },
  { ...biologicalDatabaseMeta, Content: BiologicalDatabase },
];
