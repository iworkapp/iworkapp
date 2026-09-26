import PageHeader from '../components/PageHeader.jsx'
import { usePageTitle } from '../lib/usePageTitle'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    paragraphs: [
      'iwork is a public desk for posts. Someone tweets with $iwork, the desk checks the line, and a dev decides whether it is worth paying.',
      'The reward is not a fixed amount. It is set when the post is reviewed. Until then the desk shows the post as on review.',
    ],
  },
  {
    id: 'claim',
    title: 'The claim',
    paragraphs: [
      'A claim is three things: the tweet, a link to that status on X, and the Solana address that should be paid.',
      'The tweet has to include $iwork. A tag with nothing else around it does not qualify.',
    ],
  },
  {
    id: 'checks',
    title: 'Desk checks',
    paragraphs: ['Before a post can sit in the queue, the desk refuses four kinds of claims.'],
    items: [
      'No $iwork tag, or a link that is not an X status permalink.',
      'A bot pattern: stretched characters, a very short line, or the same words repeated.',
      'A duplicate: the same status, or the same wording, already on the desk.',
      'A close rewrite of a post that is already here.',
    ],
  },
  {
    id: 'review',
    title: 'Review',
    paragraphs: ['A post that passes the checks starts on watch. A dev then picks one of three outcomes.'],
    items: [
      'Worth paying puts the post on the public board.',
      'Watch holds it. It stays off the board.',
      'Skip takes it off the board.',
    ],
  },
  {
    id: 'reward',
    title: 'The reward',
    paragraphs: [
      'There is no preset SOL figure on a new post. The amount is chosen during review, after the dev has read the line.',
      'Until that choice is recorded, every surface on the desk says the reward is on review.',
    ],
  },
  {
    id: 'payout',
    title: 'The payout record',
    paragraphs: [
      'Marking a post worth paying writes a payout in this browser: the handle, the wallet, and the post. It does not send a mainnet transaction.',
      'Seed posts on the board are samples, so the desk has a shape before anyone submits a real claim.',
    ],
  },
  {
    id: 'wallet',
    title: 'Wallet and X',
    paragraphs: [
      'Connect wallet opens Phantom, or another installed Solana wallet, and reads a mainnet balance. Linking X is a separate step.',
      'The connected address can be filled in on the claim form. The balance read does not move funds.',
    ],
  },
  {
    id: 'browser',
    title: 'What stays in this browser',
    paragraphs: [
      'Claims, review choices, and payout records are saved in this browser. Another visitor does not see them.',
      'Clearing the desk from the footer removes those local records. Sample posts remain.',
    ],
  },
]

export default function Docs() {
  usePageTitle('Docs')

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[220px_1fr]">
      <nav className="lg:sticky lg:top-8 lg:self-start" aria-label="Docs">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">Contents</p>
        <ol className="mt-4 space-y-2 text-sm">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-mute hover:text-cream">
                <span className="nums mr-2 text-faint">{index + 1}</span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article>
        <PageHeader
          kicker="Docs"
          title="How the desk works"
          lede="A tweet is the claim. The desk checks it. A dev sets the reward when the post is worth paying."
        />
        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="font-serif text-3xl tracking-tight">
                <span className="mr-3 text-marigold">{index + 1}</span>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-2xl text-sm leading-7 text-mute">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-6 text-mute">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}
