import { useState } from 'react';

function ResearchDocument({ document }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const url = `${import.meta.env.BASE_URL}${document.path}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-semibold text-slate-900 dark:text-white">{document.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{document.description}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">PDF · {document.pages} pages</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
        >
          Open PDF &rarr;
        </a>
        <a
          href={url}
          download
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
        >
          Download PDF
        </a>
      </div>

      <details
        className="mt-4"
        onToggle={(event) => setPreviewOpen(event.currentTarget.open)}
      >
        <summary className="w-fit cursor-pointer text-sm font-medium text-accent-500 hover:underline">
          Preview PDF on this page
        </summary>
        {previewOpen && (
          <div className="research-document-preview mt-3 overflow-hidden rounded-lg border border-slate-200">
            <iframe
              src={`${url}#view=FitH`}
              title={`${document.title} PDF preview`}
              className="block h-[75vh] min-h-[420px] w-full"
              loading="lazy"
            />
          </div>
        )}
      </details>
    </div>
  );
}

export default function ResearchDocuments({ documents }) {
  if (!documents?.length) return null;

  return (
    <section className="mt-10" aria-labelledby="research-documents-heading">
      <h2 id="research-documents-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
        Research documents
      </h2>
      <div className="mt-4 space-y-4">
        {documents.map((document) => <ResearchDocument key={document.path} document={document} />)}
      </div>
    </section>
  );
}
