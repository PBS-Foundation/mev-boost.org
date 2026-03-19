import React, { useState, useMemo } from 'react';
import styles from './styles.module.css';

// Research data from "Latency is Money" (dataalways) and "The Role of Time in MEV Rewards" (arxiv)
const PROFILES = {
  efficient: {
    label: 'Efficient Operator',
    description: 'Low latency, colocated or close to relay infrastructure, professional setup',
    optimalDelay: 2200,
    yieldIncrease: '~15%',
    riskLevel: 'Medium',
    recommended: {
      target_first_request_ms: 800,
      frequency_get_header_ms: 100,
      timeout_get_header_ms: 1400,
      late_in_slot_time_ms: 2500,
    },
  },
  moderate: {
    label: 'Moderate Operator',
    description: 'Standard cloud/datacenter setup, reasonable latency to relays',
    optimalDelay: 1600,
    yieldIncrease: '~8.5%',
    riskLevel: 'Low-Medium',
    recommended: {
      target_first_request_ms: 400,
      frequency_get_header_ms: 100,
      timeout_get_header_ms: 1100,
      late_in_slot_time_ms: 2000,
    },
  },
  conservative: {
    label: 'Conservative / Home Staker',
    description: 'Home setup, higher latency, DVT, or limited infrastructure',
    optimalDelay: 1200,
    yieldIncrease: '~4%',
    riskLevel: 'Low',
    recommended: {
      target_first_request_ms: 200,
      frequency_get_header_ms: 150,
      timeout_get_header_ms: 950,
      late_in_slot_time_ms: 2000,
    },
  },
};

const FORK_RISK_DATA = [
  { delay: 0, risk: 0.05, value: 0 },
  { delay: 500, risk: 0.05, value: 22 },
  { delay: 1000, risk: 0.08, value: 45 },
  { delay: 1200, risk: 0.12, value: 55 },
  { delay: 1500, risk: 0.15, value: 68 },
  { delay: 1800, risk: 0.18, value: 80 },
  { delay: 2000, risk: 0.22, value: 88 },
  { delay: 2200, risk: 0.33, value: 95 },
  { delay: 2500, risk: 1.2, value: 100 },
  { delay: 3000, risk: 5.5, value: 105 },
  { delay: 3500, risk: 15, value: 108 },
];

const RELAY_STATS = [
  { name: 'Ultra Sound', medianBidArrival: '159ms', marketShare: '~35%', recommended: true },
  { name: 'Flashbots', medianBidArrival: '-450ms', marketShare: '~20%', recommended: true },
  { name: 'Agnostic Gnosis', medianBidArrival: '107ms', marketShare: '~15%', recommended: true },
  { name: 'bloXroute (Max Profit)', medianBidArrival: '~200ms', marketShare: '~12%', recommended: true },
  { name: 'Aestus', medianBidArrival: '~180ms', marketShare: '~8%', recommended: false },
  { name: 'Titan', medianBidArrival: '~220ms', marketShare: '~5%', recommended: false },
];

function StatCard({ label, value, sublabel, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue} style={color ? { color } : {}}>
        {value}
      </div>
      {sublabel && <div className={styles.statSublabel}>{sublabel}</div>}
    </div>
  );
}

function RiskBar({ delay, risk, value, maxRisk, isSelected }) {
  const barHeight = Math.max(4, (risk / maxRisk) * 120);
  const valueWidth = Math.min(100, value);

  return (
    <div className={`${styles.riskBarContainer} ${isSelected ? styles.riskBarSelected : ''}`}>
      <div className={styles.riskBarWrapper}>
        <div
          className={styles.riskBar}
          style={{
            height: `${barHeight}px`,
            background: risk < 0.2 ? '#22c55e' : risk < 1 ? '#eab308' : risk < 5 ? '#f97316' : '#ef4444',
          }}
        />
      </div>
      <div className={styles.valueBar}>
        <div
          className={styles.valueBarFill}
          style={{ width: `${valueWidth}%` }}
        />
      </div>
      <div className={styles.riskBarLabel}>{delay}ms</div>
      <div className={styles.riskBarValue}>{risk}%</div>
    </div>
  );
}

function SlotTimeline({ profile }) {
  const config = PROFILES[profile].recommended;
  const slotDuration = 12000;
  const requestTimes = [];

  let t = config.target_first_request_ms;
  while (t < config.target_first_request_ms + config.timeout_get_header_ms) {
    requestTimes.push(t);
    t += config.frequency_get_header_ms;
  }

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>Slot Timeline (12s)</div>
      <div className={styles.timelineTrack}>
        {/* Slot markers */}
        <div className={styles.timelineMarker} style={{ left: '0%' }}>
          <div className={styles.timelineMarkerLine} />
          <div className={styles.timelineMarkerLabel}>0s</div>
        </div>
        <div className={styles.timelineMarker} style={{ left: `${(4000 / slotDuration) * 100}%` }}>
          <div className={`${styles.timelineMarkerLine} ${styles.attestationLine}`} />
          <div className={styles.timelineMarkerLabel}>4s (attest)</div>
        </div>

        {/* Safe zone */}
        <div
          className={styles.safeZone}
          style={{
            left: '0%',
            width: `${(config.late_in_slot_time_ms / slotDuration) * 100}%`,
          }}
        />

        {/* Danger zone */}
        <div
          className={styles.dangerZone}
          style={{
            left: `${(2500 / slotDuration) * 100}%`,
            width: `${((slotDuration - 2500) / slotDuration) * 100}%`,
          }}
        />

        {/* getHeader requests */}
        {requestTimes.map((t, i) => (
          <div
            key={i}
            className={styles.requestMarker}
            style={{ left: `${(t / slotDuration) * 100}%` }}
            title={`Request ${i + 1} at ${t}ms`}
          >
            <div className={styles.requestDot} />
          </div>
        ))}

        {/* Late in slot threshold */}
        <div
          className={styles.thresholdMarker}
          style={{ left: `${(config.late_in_slot_time_ms / slotDuration) * 100}%` }}
        >
          <div className={styles.thresholdLine} />
          <div className={styles.thresholdLabel}>late_in_slot ({config.late_in_slot_time_ms}ms)</div>
        </div>
      </div>
      <div className={styles.timelineLegend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDotGreen} /> Safe zone
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDotPurple} /> getHeader requests
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDotRed} /> High fork risk
        </span>
      </div>
    </div>
  );
}

export default function TimingDashboard() {
  const [selectedProfile, setSelectedProfile] = useState('moderate');
  const profile = PROFILES[selectedProfile];

  const maxRisk = useMemo(
    () => Math.max(...FORK_RISK_DATA.map((d) => d.risk)),
    []
  );

  const configYaml = useMemo(() => {
    const r = profile.recommended;
    return `# Timing Games Configuration — ${profile.label}
# Generated by mev-boost.org timing optimizer

timeout_get_header_ms: ${r.timeout_get_header_ms}
late_in_slot_time_ms: ${r.late_in_slot_time_ms}

relays:
  - url: https://0xPUBKEY@relay1.example.com
    enable_timing_games: true
    target_first_request_ms: ${r.target_first_request_ms}
    frequency_get_header_ms: ${r.frequency_get_header_ms}

  - url: https://0xPUBKEY@relay2.example.com
    enable_timing_games: true
    target_first_request_ms: ${r.target_first_request_ms}
    frequency_get_header_ms: ${r.frequency_get_header_ms}`;
  }, [selectedProfile]);

  return (
    <div className={styles.dashboard}>
      {/* Network Stats */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Network Overview</h3>
        <div className={styles.statsGrid}>
          <StatCard label="MEV-Boost Adoption" value="91%" sublabel="of blocks" color="#22c55e" />
          <StatCard label="Avg MEV Payment" value="0.00962 ETH" sublabel="per block" />
          <StatCard label="MEV Value Growth" value="5.71e-6" sublabel="ETH/ms linear rate" />
          <StatCard label="Active Relays" value="10" sublabel="14-day window" />
          <StatCard label="Active Builders" value="78" sublabel="14-day window" />
          <StatCard label="Orphan Rate" value="0.22%" sublabel="28 of 12,500 slots" color="#eab308" />
        </div>
      </div>

      {/* Profile Selector */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Select Your Operator Profile</h3>
        <div className={styles.profileGrid}>
          {Object.entries(PROFILES).map(([key, p]) => (
            <button
              key={key}
              className={`${styles.profileCard} ${selectedProfile === key ? styles.profileCardActive : ''}`}
              onClick={() => setSelectedProfile(key)}
            >
              <div className={styles.profileLabel}>{p.label}</div>
              <div className={styles.profileDesc}>{p.description}</div>
              <div className={styles.profileMeta}>
                <span>Yield: <strong>{p.yieldIncrease}</strong></span>
                <span>Risk: <strong>{p.riskLevel}</strong></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Configuration */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Recommended Configuration — {profile.label}
        </h3>
        <div className={styles.configGrid}>
          <StatCard
            label="target_first_request_ms"
            value={`${profile.recommended.target_first_request_ms}ms`}
            sublabel="Delay before first getHeader"
          />
          <StatCard
            label="frequency_get_header_ms"
            value={`${profile.recommended.frequency_get_header_ms}ms`}
            sublabel="Interval between requests"
          />
          <StatCard
            label="timeout_get_header_ms"
            value={`${profile.recommended.timeout_get_header_ms}ms`}
            sublabel="Max getHeader timeout"
          />
          <StatCard
            label="late_in_slot_time_ms"
            value={`${profile.recommended.late_in_slot_time_ms}ms`}
            sublabel="Fallback to local building"
          />
        </div>
      </div>

      {/* Slot Timeline Visualization */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Slot Timeline</h3>
        <SlotTimeline profile={selectedProfile} />
      </div>

      {/* Fork Risk vs Value Chart */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Fork Risk vs. Value Captured by Delay</h3>
        <p className={styles.chartDescription}>
          <strong>Bars</strong> = fork/reorg risk (%). <strong>Green fill</strong> = % of max capturable MEV value.
          Risk spikes sharply beyond 2500ms.
        </p>
        <div className={styles.riskChart}>
          {FORK_RISK_DATA.map((d) => (
            <RiskBar
              key={d.delay}
              delay={d.delay}
              risk={d.risk}
              value={d.value}
              maxRisk={maxRisk}
              isSelected={
                d.delay >= profile.recommended.target_first_request_ms &&
                d.delay <= profile.recommended.target_first_request_ms + profile.recommended.timeout_get_header_ms
              }
            />
          ))}
        </div>
      </div>

      {/* Relay Performance */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Relay Performance</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.relayTable}>
            <thead>
              <tr>
                <th>Relay</th>
                <th>Median Winning Bid Arrival</th>
                <th>Market Share</th>
                <th>Recommended</th>
              </tr>
            </thead>
            <tbody>
              {RELAY_STATS.map((r) => (
                <tr key={r.name}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.medianBidArrival}</td>
                  <td>{r.marketShare}</td>
                  <td>{r.recommended ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Config */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Generated config.yaml</h3>
        <p className={styles.configHint}>
          Copy this configuration and adjust relay URLs to your own pubkeys.
        </p>
        <div className={styles.codeBlock}>
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard?.writeText(configYaml)}
          >
            Copy
          </button>
          <pre><code>{configYaml}</code></pre>
        </div>
      </div>

      {/* Data Sources */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Data Sources & Methodology</h3>
        <ul className={styles.sourcesList}>
          <li>
            <strong>Yield & delay optimization</strong> — <a href="https://hackmd.io/@dataalways/latency-is-money" target="_blank" rel="noopener">Latency is Money: Timing Games /acc</a> (dataalways)
          </li>
          <li>
            <strong>MEV value growth rate</strong> — <a href="https://arxiv.org/html/2307.05814" target="_blank" rel="noopener">The Role of Time in MEV Rewards</a> (arXiv 2307.05814)
          </li>
          <li>
            <strong>Block delay & consensus impact</strong> — <a href="https://ethresear.ch/t/empirical-analysis-of-the-impact-of-block-delays-on-the-consensus-layer/17888" target="_blank" rel="noopener">Empirical Analysis of Block Delays</a> (ethresear.ch)
          </li>
          <li>
            <strong>Network statistics</strong> — <a href="https://mevboost.pics/" target="_blank" rel="noopener">mevboost.pics</a> (Toni Wahrstatter / Xatu Data)
          </li>
          <li>
            <strong>Timing games mechanics</strong> — <a href="https://www.paradigm.xyz/2023/04/mev-boost-ethereum-consensus" target="_blank" rel="noopener">Time, Slots, and the Ordering of Events</a> (Paradigm)
          </li>
        </ul>
      </div>
    </div>
  );
}
