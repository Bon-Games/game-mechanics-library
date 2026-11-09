import { hasOwnSummary, type MechanicCard as Card } from "../domain/schema";
import { withBase } from "../domain/urls";

type Props = {
  entry: Card; base: string; missing?: string; reviewed?: string; interfaceLang?: string;
  previewLabel?: string; onPreview?: (entry: Card, trigger: HTMLButtonElement) => void;
};

export function detailHref(base: string, id: string, interfaceLang: string): string {
  return withBase(base, "mechanics/" + id) + (interfaceLang === "vi" ? "?lang=vi" : "");
}

export default function MechanicCard({ entry, base, missing, reviewed = "Reviewed entry", interfaceLang = "en", previewLabel = "Preview", onPreview }: Props) {
  const showSummary = hasOwnSummary(entry) || !missing;
  return (
    <article className="mechanic-card" lang="en">
      <span className="entry-tag">{entry.subcategoryTitle}</span>
      <h4><a href={detailHref(base, entry.id, interfaceLang)}>{entry.title}</a></h4>
      <p lang={showSummary ? "en" : interfaceLang}>{showSummary ? entry.summary : missing}</p>
      <div className="entry-meta">
        <span>{entry.categoryTitle}</span>
        {entry.maturity === "reviewed" && <span className="research-status" lang={interfaceLang}>{reviewed}</span>}
        {onPreview && <button type="button" className="preview-button" lang={interfaceLang} aria-haspopup="dialog" aria-label={previewLabel + ": " + entry.title}
          onClick={(event) => onPreview(entry, event.currentTarget)}>{previewLabel}</button>}
      </div>
    </article>
  );
}
