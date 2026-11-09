import { useEffect, useRef } from "react";
import { hasOwnSummary, type MechanicCard as Card } from "../domain/schema";
import { withBase } from "../domain/urls";
import { detailHref } from "./MechanicCard";

type Labels = { closePreview: string; viewDetails: string; noMedia: string; missing: string; reviewed: string };
type Props = { entry: Card | null; base: string; interfaceLang: string; labels: Labels; onClose: () => void };

function PreviewMediaView({ entry, base, noMedia, interfaceLang }: { entry: Card; base: string; noMedia: string; interfaceLang: string }) {
  const media = entry.media;
  if (media.kind === "video") {
    return <iframe className="video-frame" src={"https://www.youtube-nocookie.com/embed/" + media.videoId} title={media.title}
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />;
  }
  if (media.kind === "image") return <img className="preview-image" src={withBase(base, media.src)} alt={media.alt} />;
  return <div className="media-placeholder" lang={interfaceLang}><svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9.5v5l4-2.5z" fill="currentColor" /></svg><span>{noMedia}</span></div>;
}

/** Modal summary of one card; the content (and any player) only exists while open. */
export default function MechanicPreview({ entry, base, interfaceLang, labels, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !entry) return;
    if (!element.open) element.showModal();
    closeButton.current?.focus();
    document.body.classList.add("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [entry]);

  const ownSummary = entry ? hasOwnSummary(entry) : false;
  return (
    <dialog ref={dialog} className="preview-dialog" aria-labelledby="preview-title" lang="en" onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      {entry && <div className="preview-body">
        <div className="preview-header">
          <span className="entry-tag">{entry.subcategoryTitle}</span>
          <button ref={closeButton} type="button" lang={interfaceLang} onClick={() => dialog.current?.close()}>{labels.closePreview}</button>
        </div>
        <div className="preview-media"><PreviewMediaView entry={entry} base={base} noMedia={labels.noMedia} interfaceLang={interfaceLang} /></div>
        <h2 id="preview-title">{entry.title}</h2>
        <p className="preview-classification">{entry.categoryTitle}<span aria-hidden="true"> / </span>{entry.subcategoryTitle}</p>
        {entry.maturity === "reviewed" ? <p className="research-status" lang={interfaceLang}>{labels.reviewed}</p> : ownSummary && <p className="research-status" lang={interfaceLang}>{labels.missing}</p>}
        <p className="preview-summary" lang={ownSummary ? "en" : interfaceLang}>{ownSummary ? entry.summary : labels.missing}</p>
        <div className="preview-actions"><a className="button button-primary" lang={interfaceLang} href={detailHref(base, entry.id, interfaceLang)}>{labels.viewDetails}</a></div>
      </div>}
    </dialog>
  );
}
