import PageHeader from '../components/PageHeader.jsx'
import { usePageTitle } from '../lib/usePageTitle'
import { COIN_ADDRESS } from '../solana/coin'
import { TREASURY_ADDRESS } from '../solana/treasury'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    paragraphs: [
      'iwork is a public desk for posts on X. Someone tweets with $iwork, the desk checks the post, and a dev decides whether it is worth paying.',
      'The reward has no fixed amount. It is set when the post is reviewed. Until then the desk shows the post as on review.',
    ],
  },
  {
    id: 'claim',
    title: 'The claim',
    paragraphs: [
      'A claim is two things: a link to the post on X, and the Solana address that should be paid. The text of the post is read from X when the desk can reach it.',
      'The post has to include $iwork. A tag with nothing else around it does not qualify.',
      'The desk also searches X for new $iwork posts. A post found that way waits on watch until its author claims it with a wallet.',
    ],
  },
  {
    id: 'checks',
    title: 'Desk checks',
    paragraphs: ['Before a post can sit in the queue, the desk refuses these claims.'],
    items: [
      'No $iwork tag, or a link that is not a post on X.',
      'A post X cannot find, such as a deleted or private one.',
      'A bot pattern: stretched characters, a very short line, or the same words repeated.',
      'A duplicate: the same post, or the same wording, already on the desk.',
      'A close rewrite of a post that is already here.',
    ],
  },
  {
    id: 'review',
    title: 'Review',
    paragraphs: ['A post that passes the checks starts on watch. A dev then picks one of three outcomes.'],
    items: ['Worth paying puts the post on the public board.', 'Watch holds it off the board for now.', 'Skip takes it off the board.'],
  },
  {
    id: 'reward',
    title: 'The reward',
    paragraphs: [
      'A new post has no preset SOL figure. The amount is chosen during review, after the dev has read the post.',
      'Until that amount is set, the desk says the reward is on review.',
    ],
  },
  {
    id: 'payout',
    title: 'The payout',
    paragraphs: [
      'A post marked worth paying is recorded as a payout: the handle, the wallet, the post, and the SOL. The record is kept off-chain by the desk.',
      'The SOL is sent from the treasury wallet. Once it is sent, the payout shows Sent and links to its Solana transaction, so anyone can check it.',
      'Sends move fully on-chain once volume grows.',
    ],
  },
  {
    id: 'treasury',
    title: 'Treasury',
    paragraphs: [
      `The treasury wallet ${TREASURY_ADDRESS} holds the SOL. Its balance is read live from Solana mainnet.`,
      'Creator fees from the coin on Pump.fun are claimed into this wallet. That is where every reward comes from.',
      ...(COIN_ADDRESS ? [`The coin contract address is ${COIN_ADDRESS}.`] : []),
    ],
  },
  {
    id: 'wallet',
    title: 'Wallet and X',
    paragraphs: [
      'Connect wallet opens Phantom, or another installed Solana wallet, and reads its mainnet balance. Connecting never moves funds.',
      'The connected address can fill in the claim form. Linking X is a separate step.',
    ],
  },
  {
    id: 'samples',
    title: 'Sample posts',
    paragraphs: ['Until the first real post is marked worth paying, the board shows a few samples so the page has a shape. They are labeled Sample and link nowhere.'],
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

      <article className="min-w-0">
        <PageHeader kicker="Docs" title="How the desk works" lede="A tweet is the claim. The desk checks it. A dev sets the reward when the post is worth paying." />
        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="font-serif text-3xl tracking-tight">
                <span className="mr-3 text-marigold">{index + 1}</span>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-2xl break-words text-sm leading-7 text-mute">
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
