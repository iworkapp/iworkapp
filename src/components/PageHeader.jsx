export default function PageHeader({ kicker, title, lede, action, animate = true }) {
  return (
    <div className={`${animate ? 'col-in' : ''} flex flex-wrap items-end justify-between gap-6`}>
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">{kicker}</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        {lede ? <p className="mt-4 max-w-xl text-base leading-7 text-mute">{lede}</p> : null}
      </div>
      {action}
    </div>
  )
}
