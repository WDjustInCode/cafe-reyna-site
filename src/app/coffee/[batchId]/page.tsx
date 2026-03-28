import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBatchById } from '@/app/lib/api';
import {
  getDaysOld,
  getFreshnessState,
  getFreshnessBadgeLabel,
  getDiscountedPrice,
} from '@/app/lib/freshness';
import { BatchBuilderClient } from '@/app/components/BatchBuilderClient';
import { CartButton } from '@/app/components/CartContext';
import { HamburgerMenu } from '@/app/components/HamburgerMenu';

interface BatchPageParams {
  batchId: string;
}

export default async function BatchPage({ params }: { params: Promise<BatchPageParams> }) {
  const { batchId } = await params;

  const batch = await fetchBatchById(batchId);
  if (!batch) notFound();

  const daysOld = getDaysOld(batch.roastDate);
  const freshnessState = getFreshnessState(daysOld);
  const badgeLabel = getFreshnessBadgeLabel(freshnessState);
  const discountedPrice = getDiscountedPrice(batch.basePrice, daysOld);
  const isDiscounted = freshnessState !== 'fresh';

  const roastDateFormatted = new Date(batch.roastDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f4ede4] text-[#2a2a2a]">
      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24 pt-6 sm:px-8 md:px-10">
        {/* Header (shared shell) */}
        <section aria-label="Site header">
          <div className="relative flex items-center justify-between border-b border-[#e3d7c5] pb-4">
            <Link href="/#our-coffee">
              <Image
                src="/crown-logo.png"
                alt="Café Reyna"
                width={105}
                height={35}
                className="h-[35px] w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-3">
              <CartButton />
              <HamburgerMenu basePath="/" />
            </div>
          </div>
        </section>

        {/* Batch Hero / Intro Band */}
        <section
          aria-label="Selected batch hero"
          className="space-y-4 border-b border-[#e3d7c5] pb-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7a6a5a]">
            Current Roast Batch
          </p>
          <h1 className="text-2xl font-semibold">
            <span className="font-mono">{batch.batchCode}</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#4a4037]">
            {batch.farmName} · {batch.origin}
          </p>
        </section>

        <BatchBuilderClient
          batch={batch}
          daysOld={daysOld}
          freshnessState={freshnessState}
          badgeLabel={badgeLabel}
          discountedPrice={discountedPrice}
          isDiscounted={isDiscounted}
          roastDateFormatted={roastDateFormatted}
        />

        {/* Footer */}
        <section aria-label="Site footer" className="mt-8">
          <footer className="space-y-4 border-t border-[#e3d7c5] pt-4 text-xs text-[#6b5a4a]">
            <p>© {new Date().getFullYear()} Café Reyna. All rights reserved.</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
