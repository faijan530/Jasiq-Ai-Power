export function PdfPreviewCard({ pdfUrl }: { pdfUrl: string | null | undefined }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200/80">
      <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">PDF Preview</div>
      {!pdfUrl ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">Generate a PDF to preview it here.</div>
      ) : (
        <div className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
          <iframe title="Resume PDF" src={pdfUrl} className="h-[420px] w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

