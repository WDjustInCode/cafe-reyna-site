import Image from 'next/image';

const cards = [
  {
    icon: '/origin_1.svg',
    title: 'Origin-focused',
    description:
      'Every cup traces back to a specific farm and lot in Honduras. No blends, no mystery origins — just single-source coffee you can follow.',
    iconClass: 'h-20 w-20 object-contain md:h-24 md:w-24',
  },
  {
    icon: '/fresh_1.svg',
    title: 'Fresh roast batches',
    description:
      'We roast in small batches and price by age. The fresher the roast, the higher the price. Older batches get discounted — never hidden.',
    iconClass: 'h-[62px] w-[62px] object-contain md:h-[72px] md:w-[72px]',
  },
  {
    icon: '/trace_1.svg',
    title: 'Traceable lots',
    description:
      'Each lot comes from one farm, processed consistently. You see the farm, the variety, the process — before you buy.',
    iconClass: 'h-[72px] w-[72px] object-contain md:h-[80px] md:w-[80px]',
  },
  {
    icon: '/drip_1.svg',
    title: 'Brew-method aware',
    description:
      'Grind options are labeled by brew method, not technical jargon. Pick your brewer, get the right grind.',
    iconClass: 'h-20 w-20 object-contain md:h-24 md:w-24',
  },
];

export function WhyReyna() {
  return (
    <section id="why-cafe-reyna" aria-label="Why Café Reyna" className="space-y-16">
      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
          Why Café Reyna
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Origin-first. Freshness-driven.
        </h2>
        <p className="text-base leading-[1.7] text-[#4a4037]">
          We built Café Reyna around one idea: coffee is better when you know
          where it came from and how fresh it is.
        </p>
      </header>

      <div className="grid gap-x-12 gap-y-14 md:grid-cols-4 md:gap-x-16">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col gap-6">
            <div className="flex h-24 items-center md:h-28">
            <Image
              src={card.icon}
              alt=""
              aria-hidden="true"
              width={120}
              height={120}
              className={card.iconClass}
            />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold">{card.title}</h3>
            </div>
            <p className="text-base leading-[1.7] text-[#4a4037]">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
