import type { AgentConfig, Mod, Overview } from './types';
import { displayDate, readiness } from './mod-details';

const names: Record<string,string>={mint:'Mint','claude-code':'Claude Code'};
export function ModOverview({mod,config}:{mod:Mod;config:AgentConfig}) {
  const summary: Overview=config.overview || mod.overview || {purpose:mod.description,placement:'See the creation prompt for the supported layout.',actions:[]};
  return <section className="mod-overview" aria-labelledby="mod-overview-title">
    <div className="section-heading"><h2 id="mod-overview-title">At a glance</h2><span className="readiness-label">{readiness(config)}</span></div>
    <p>{summary.purpose}</p>
    <dl>
      <div><dt>Display</dt><dd>{summary.placement}</dd></div>
      <div><dt>Actions</dt><dd>{summary.actions.length ? <ul>{summary.actions.map(action=><li key={action}>{action}</li>)}</ul> : 'No interactive actions listed.'}</dd></div>
      <div><dt>Requires</dt><dd>{mod.requiredCapabilities?.length ? <ul>{mod.requiredCapabilities.map(capability=><li key={capability}>{capability}</li>)}</ul> : 'Your agent should inspect the requirements in the prompt.'}</dd></div>
    </dl>
  </section>;
}
export function HarnessVerification({mod}:{mod:Mod}) {
  const entries=Object.entries(mod.agents);
  return <section className="harness-verification" aria-labelledby="verification-heading"><h2 id="verification-heading">Harness verification</h2>
    <p>Runtime testing for the listed implementations.</p>
    {!entries.length ? <p>No harness implementation is listed. Validate the generated mod in your environment.</p> : entries.map(([id,config])=>{
      const check=config.verification;
      const label=check?.status==='verified'?'Verified':check?.status==='needs-review'?'Needs review':'Not verified';
      return <div className="verification-row" key={id}>
        <div><strong>{names[id] || id}</strong><span className={`verification-label ${check?.status || 'not-verified'}`}>{label}</span></div>
        <small>{readiness(config)} · {config.compatibility}</small>
        {check?.environment && <small>{check.environment}{check.date && ` · ${displayDate(check.date)}`}</small>}
        <p>{check?.notes || (check?.status==='verified'?'See the recorded test evidence.':'No runtime test report recorded.')}</p>
        {check?.evidence && <a href={check.evidence} target="_blank" rel="noreferrer">View test evidence</a>}
      </div>;
    })}
    {mod.adaptationPrompt && <p className="verification-note">Adaptations need validation in your chosen harness.</p>}
  </section>;
}
export function Changelog({mod}:{mod:Mod}) {
  return <section className="changelog" aria-labelledby="changelog-heading"><div className="section-heading"><h2 id="changelog-heading">Changelog</h2><span>Updated {displayDate(mod.updated)}</span></div>
    {mod.changelog?.length ? <ol>{mod.changelog.map((change,index)=><li key={`${change.date}-${index}`}><div><time dateTime={change.date}>{displayDate(change.date)}</time><span>{change.scope}</span></div><p>{change.summary}</p></li>)}</ol> : <p>No change history recorded.</p>}
  </section>;
}
