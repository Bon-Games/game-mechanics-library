import type { MechanicCard as Card } from "../domain/schema";
import { withBase } from "../domain/urls";

export default function MechanicCard({ entry, base, missing, reviewed = "Reviewed entry", interfaceLang = "en" }: { entry: Card; base: string; missing?: string; reviewed?: string; interfaceLang?: string }) {
  return (
    <article className="mechanic-card" lang="en">
      <span className="entry-tag">{entry.subcategoryTitle}</span>
      <h4><a href={withBase(base, "mechanics/" + entry.id) + (interfaceLang === "vi" ? "?lang=vi" : "")}>{entry.title}</a></h4>
      <p lang={entry.maturity === "starter" ? interfaceLang : "en"}>{entry.maturity === "starter" && missing ? missing : entry.summary}</p>
      <div className="entry-meta"><span>{entry.categoryTitle}</span>{entry.maturity === "reviewed" && <span className="research-status" lang={interfaceLang}>{reviewed}</span>}</div>
    </article>
  );
}
