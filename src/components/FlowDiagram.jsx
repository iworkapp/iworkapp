const DUR = '8s'

const lanes = [
  {
    d: 'M 168 168 H 248',
    times: '0;0.04;0.28;1',
    dashFrom: '34',
    dashTo: '-80',
  },
  {
    d: 'M 398 168 H 470 C 530 168 548 78 610 78',
    times: '0;0.28;0.58;1',
    dashFrom: '40',
    dashTo: '-160',
  },
  {
    d: 'M 398 168 H 470 C 530 168 548 258 610 258',
    times: '0;0.42;0.78;1',
    dashFrom: '40',
    dashTo: '-160',
  },
]

function Packet({ lane }) {
  return (
    <g className="motion-reduce:hidden">
      <path
        d={lane.d}
        fill="none"
        stroke="#f1642d"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${lane.dashFrom} 280`}
        opacity="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${lane.dashFrom};${lane.dashFrom};${lane.dashTo};${lane.dashTo}`}
          keyTimes={lane.times}
          dur={DUR}
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes={lane.times} dur={DUR} repeatCount="indefinite" />
      </path>
      <circle r="5.5" fill="#ff7a45">
        <animateMotion
          dur={DUR}
          repeatCount="indefinite"
          path={lane.d}
          keyPoints="0;0;1;1"
          keyTimes={lane.times}
          calcMode="linear"
        />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes={lane.times} dur={DUR} repeatCount="indefinite" />
      </circle>
    </g>
  )
}

function Node({ x, y, title, detail }) {
  return (
    <g>
      <rect x={x} y={y} width="148" height="88" rx="22" fill="#1b1814" stroke="#3c342c" />
      <text x={x + 74} y={y + 38} textAnchor="middle" fill="#f4efe6" fontSize="15" fontWeight="600">
        {title}
      </text>
      <text x={x + 74} y={y + 60} textAnchor="middle" fill="#9c9388" fontSize="11">
        {detail}
      </text>
    </g>
  )
}

export default function FlowDiagram() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-ink/50">
      <svg viewBox="0 0 860 340" className="h-auto w-full font-sans" role="img" aria-label="A post moves from the tweet, through the desk, then to worth paying or watch.">
        <path d="M 168 168 H 248" fill="none" stroke="#3c342c" strokeWidth="2" />
        <path d="M 398 168 H 470 C 530 168 548 78 610 78" fill="none" stroke="#3c342c" strokeWidth="2" />
        <path d="M 398 168 H 470 C 530 168 548 258 610 258" fill="none" stroke="#3c342c" strokeWidth="2" />
        {lanes.map((lane) => (
          <Packet key={lane.d} lane={lane} />
        ))}
        <Node x="16" y="124" title="Tweet" detail="$iwork post" />
        <Node x="248" y="124" title="Desk" detail="Checks the line" />
        <Node x="610" y="34" title="Worth paying" detail="Reward on review" />
        <Node x="610" y="214" title="Watch" detail="Held for later" />
      </svg>
    </div>
  )
}
