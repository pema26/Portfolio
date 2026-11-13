// ============================================================================
//  CodeBlock.jsx: a block of source code inside a write-up
// ============================================================================
//
//  PURPOSE: shows code exactly as typed (spaces and line breaks kept) in a
//  dark, horizontally scrollable panel. Used by the content components in
//  src/content/. The colours and spacing come from the `.prose-content pre`
//  rules in src/styles/global.css.
//
//  PROPS:
//    code: the source code, as a string.
//    language: e.g. "python" or "cpp". Stored on the element as data-language.
//
//  tabIndex={0} lets keyboard users focus the block and scroll long lines.
// ============================================================================

function CodeBlock({ code, language }) {
  return (
    <pre tabIndex={0} role="group" aria-label={language ? `${language} code sample` : 'Code sample'} data-language={language}>
      <code>{code}</code>
    </pre>
  );
}

export default CodeBlock;
