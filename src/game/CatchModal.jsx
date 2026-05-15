import { useEffect } from 'react';

function ActionIcon({ kind }) {
  const map = {
    email: '✉',
    github: '◆',
    linkedin: 'in',
    phone: '☏',
    download: '↓',
    external: '↗',
  };
  return <span className="modal-action-icon">{map[kind] || '·'}</span>;
}

// Renders a single company block inside a multi-job "Experience" catch.
// Mirrors the About-zine JobCard but in modal-scoped class names.
function ModalJob({ job }) {
  const companyEl = job.companyHref ? (
    <a href={job.companyHref} target="_blank" rel="noreferrer" className="modal-link">
      {job.company}<span className="modal-link-arrow" aria-hidden="true">↗</span>
    </a>
  ) : job.company;

  const hasTimeline = job.positions && job.positions.length > 1;
  const onePos = job.positions && job.positions.length === 1 ? job.positions[0] : null;

  return (
    <article className="modal-job">
      <header className="modal-job-head">
        <div className="modal-job-company">{companyEl}</div>
        {job.location && <div className="modal-job-location">{job.location}</div>}
      </header>

      {job.summary && <p className="modal-job-summary">{job.summary}</p>}

      {hasTimeline && (
        <ol className="modal-timeline">
          {job.positions.map((p, i) => (
            <li
              key={i}
              className={`modal-timeline-item ${p.current ? 'is-current' : ''}`}>
              <div className="modal-timeline-marker" aria-hidden="true" />
              <div className="modal-timeline-content">
                <div className="modal-timeline-role">{p.role}</div>
                <div className="modal-timeline-span">{p.span}</div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {onePos && (
        <div className="modal-job-singlepos">
          <div className="modal-job-role">{onePos.role}</div>
          <div className="modal-job-span">{onePos.span}</div>
        </div>
      )}

      {job.bullets && job.bullets.length > 0 && (
        <ul className="modal-bullets modal-bullets--compact">
          {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}

      {job.stack && (
        <div className="modal-job-stack">
          <span className="modal-job-stack-label">Stack</span>
          <span className="modal-job-stack-value">{job.stack}</span>
        </div>
      )}
    </article>
  );
}

export default function CatchModal({ catchObj, onClose, onNext, hasNext }) {
  useEffect(() => {
    if (!catchObj) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [catchObj, onClose]);

  if (!catchObj) return null;

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="close">×</button>

        <div className="modal-glow" style={{ '--glow': catchObj.glow }}>
          <div className="modal-icon" style={{ color: catchObj.glow }}>{catchObj.icon}</div>
        </div>

        <div className="modal-body">
          <div className="modal-eyebrow">{catchObj.eyebrow}</div>
          <h2 className="modal-title">{catchObj.title}</h2>

          {catchObj.body && catchObj.body.map((p, i) => (
            <p key={i} className="modal-para">{p}</p>
          ))}

          {catchObj.jobs && (
            <div className="modal-jobs">
              {catchObj.jobs.map((job, i) => <ModalJob key={i} job={job} />)}
            </div>
          )}

          {catchObj.bullets && (
            <ul className="modal-bullets">
              {catchObj.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}

          {catchObj.groups && (
            <div className="modal-groups">
              {catchObj.groups.map((g, i) => (
                <div key={i} className="modal-group">
                  <div className="modal-group-label">{g.label}</div>
                  <div className="modal-chips">
                    {g.items.map((it, j) => (
                      <span key={j} className="modal-chip">{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {catchObj.meta && (
            <dl className="modal-meta">
              {catchObj.meta.map((m, i) => (
                <div key={i} className="modal-meta-row">
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {catchObj.actions && (
            <div className="modal-actions">
              {catchObj.actions.map((a, i) => {
                const isNewTab = a.kind === 'external' || a.kind === 'github' || a.kind === 'linkedin';
                return (
                  <a
                    key={i}
                    href={a.href}
                    target={isNewTab ? '_blank' : undefined}
                    rel="noreferrer"
                    download={a.kind === 'download' ? '' : undefined}
                    className={`modal-action modal-action--${a.kind}`}>
                    <ActionIcon kind={a.kind} />
                    <span>{a.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-foot">
          <span className="modal-foot-hint">esc to close</span>
          {hasNext && (
            <button className="modal-next" onClick={onNext}>
              cast again →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
