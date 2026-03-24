import { fetchAllBatchViewModels } from '@/app/lib/api';
import type { BatchCardViewModel } from '@/app/lib/types';
import { BatchGridClient } from './BatchGridClient';

export async function BatchGrid({ batches: prefetched }: { batches?: BatchCardViewModel[] } = {}) {
  let batches: BatchCardViewModel[];

  if (prefetched !== undefined) {
    batches = prefetched;
  } else {
    try {
      batches = await fetchAllBatchViewModels();
    } catch {
      return (
        <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] px-8 py-10 text-center">
          <p className="text-base text-[#4a4037]">Unable to load current roast batches.</p>
          <p className="mt-1 text-xs text-[#7a6a5a]">Please try refreshing the page.</p>
        </div>
      );
    }
  }

  if (batches.length === 0) {
    return (
      <div className="rounded-xl border border-[#e3d7c5] bg-[#f8f2e8] px-8 py-12 text-center">
        <p className="text-base text-[#4a4037]">
          No current roast batches are available right now.
        </p>
        <p className="mt-1 text-xs text-[#7a6a5a]">
          Check back soon or contact us about upcoming availability.
        </p>
      </div>
    );
  }

  return <BatchGridClient batches={batches} />;
}
