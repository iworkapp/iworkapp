import { NavLink } from 'react-router-dom'
import ConnectButton from './ConnectButton.jsx'

const links = [
  {
    to: '/',
    label: 'Home',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    ),
  },
  {
    to: '/board',
    label: 'Board',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h7v6H4v-6Zm9 0h7v3h-7v-3ZM13 11.5h7v7h-7v-7ZM4 14.5h7v4H4v-4Z" />
      </svg>
    ),
  },
  {
    to: '/payouts',
    label: 'Payouts',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5h12a1 1 0 0 1 1 1v13l-3-1.6-3 1.6-3-1.6-3 1.6v-13a1 1 0 0 1 1-1Z" />
        <path strokeLinecap="round" d="M9 9h6M9 12.5h4" />
      </svg>
    ),
  },
  {
    to: '/capital-flow',
    label: 'Capital flow',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h6l2-4 3 8 2-4h3" />
      </svg>
    ),
  },
  {
    to: '/docs',
    label: 'Docs',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h8.5L19 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" />
        <path strokeLinecap="round" d="M15 4.5V8h4M8.5 12.5h7M8.5 16h5" />
      </svg>
    ),
  },
  {
    to: '/tweet',
    label: 'Tweet to get paid',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 7.5h11a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1H11l-3.2 2.4v-2.4H6.5a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
]

function linkClass(isActive, collapsed) {
  return `flex items-center rounded-2xl py-2.5 text-sm font-medium transition ${
    collapsed ? 'justify-center px-0' : 'gap-3 px-3'
  } ${isActive ? 'bg-panel text-cream' : 'text-mute hover:bg-panel/70 hover:text-cream'}`
}

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {collapsed ? null : (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          aria-label="Minimize sidebar"
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-ink transition-[width] duration-300 ease-out ${
          collapsed ? 'w-[4.5rem]' : 'w-60'
        }`}
      >
        <div className={`flex items-center pt-5 ${collapsed ? 'justify-center px-2' : 'gap-2.5 px-4'}`}>
          <NavLink
            to="/"
            className="block h-10 w-10 shrink-0 overflow-hidden rounded-lg"
            aria-label="iwork home"
          >
            <img src="/IWORKPFP.jpg" alt="" className="h-full w-full object-cover" />
          </NavLink>
          <span className={`inline-block overflow-hidden whitespace-nowrap align-bottom text-lg font-semibold tracking-tight transition-[max-width,opacity] duration-300 ease-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-28 opacity-100'}`}>
            iwork
          </span>
        </div>

        <nav className={`mt-8 flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`} aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) => linkClass(isActive, collapsed)}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-marigold' : ''}>{link.icon}</span>
                  <span className={`inline-flex items-center gap-2 overflow-hidden whitespace-nowrap align-bottom transition-[max-width,opacity] duration-300 ease-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            title={collapsed ? 'Admin' : undefined}
            className={({ isActive }) => `${linkClass(isActive, collapsed)} mt-auto`}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-marigold' : ''}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <circle cx="8" cy="15" r="3.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.5 19 4l1.5 1.5-2 1 1.2 1.2-1.5 1.5-1.2-1.2-2.2 2.2" />
                  </svg>
                </span>
                <span className={`inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width,opacity] duration-300 ease-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'}`}>
                  Admin
                </span>
              </>
            )}
          </NavLink>
        </nav>

        <div className={`space-y-2 pb-4 ${collapsed ? 'px-2' : 'px-3'}`}>
          <ConnectButton compact={collapsed} />
          <button
            type="button"
            className={`flex items-center overflow-hidden rounded-2xl border border-line py-2.5 text-sm font-medium text-mute transition hover:border-cream/30 hover:text-cream ${
              collapsed ? 'mx-auto h-11 w-11 justify-center' : 'w-full gap-3 px-3'
            }`}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
            onClick={onToggle}
          >
            <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5 9 12l5.5 5.5" />
            </svg>
            <span className={`inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width,opacity] duration-300 ease-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-28 opacity-100'}`}>Minimize</span>
          </button>
        </div>
      </aside>
    </>
  )
}
