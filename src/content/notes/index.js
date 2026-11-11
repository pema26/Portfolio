// ============================================================================
//  src/content/notes/index.js  —  the list of every NOTE (short blog post)
// ============================================================================
//
//  Same pattern as src/content/projects/index.js: each note is a .jsx file
//  with a `meta` named export and a default-exported write-up component.
//
//  HOW TO ADD ONE: copy an existing file in this folder, edit it, then import
//  it below and add one line to the `notes` array.
// ============================================================================

import Welcome, { meta as welcomeMeta } from './welcome';

export const notes = [
  { ...welcomeMeta, Content: Welcome },
];
