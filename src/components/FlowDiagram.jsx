const boxes = [
  { title: 'Pump.fun', detail: 'Creator fees accrue on the coin.' },
  { title: 'Fee claimed', detail: 'Fees are claimed on a schedule.' },
  { title: 'Sent to X user', detail: 'The share is paid to the X account.' },
]

function Connector() {
  return (
    <svg viewBox="0 0 120 48" className="h-10 w-full min-w-16" aria-hidden="true">
      <path d="M 4 24 H 116" fill="none" stroke="#3c342c" strokeWidth="2" />
      <g className="motion-reduce:hidden">
        <path d="M 4 24 H 116" fill="none" stroke="#f1642d" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="28 140" opacity="0">
          <animate attributeName="stroke-dashoffset" values="28;-140" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.8s" repeatCount="indefinite" />
        </path>
        <circle r="5" fill="#ff7a45">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 4 24 H 116" />
        </circle>
      </g>
    </svg>
  )
}

export default function FlowDiagram() {
  return (
    <div className="rounded-[28px] border border-line bg-ink/50 px-4 py-8 sm:px-8">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_minmax(4rem,7rem)_1fr_minmax(4rem,7rem)_1fr]">
        {boxes.map((box, index) => (
          <div key={box.title} className="contents">
            {index > 0 ? (
              <div className="hidden md:block">
                <Connector />
              </div>
            ) : null}
            <article className="rounded-[24px] border border-line bg-panel px-5 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-marigold">0{index + 1}</p>
              <h3 className="mt-3 font-serif text-2xl tracking-tight text-cream">{box.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{box.detail}</p>
            </article>
            {index < boxes.length - 1 ? (
              <div className="md:hidden">
                <Connector />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
