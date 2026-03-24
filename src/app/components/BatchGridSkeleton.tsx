function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[10px] border border-[#e3d7c5] bg-[#f8f2e8] p-7 animate-pulse">
      <div className="mb-4 space-y-2">
        <div className="h-5 w-3/4 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-1/2 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-2/5 rounded bg-[#e3d7c5]" />
      </div>
      <div className="mb-4 space-y-3">
        <div className="h-3 w-1/4 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-1/3 rounded bg-[#e3d7c5]" />
        <div className="h-3 w-1/4 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-1/3 rounded bg-[#e3d7c5]" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3 w-1/4 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-4/5 rounded bg-[#e3d7c5]" />
      </div>
      <div className="mb-6 space-y-2">
        <div className="h-3 w-1/4 rounded bg-[#e3d7c5]" />
        <div className="h-3.5 w-1/3 rounded bg-[#e3d7c5]" />
        <div className="h-3 w-1/4 rounded bg-[#e3d7c5]" />
        <div className="h-[6px] w-full rounded bg-[#e3d7c5]" />
        <div className="h-6 w-24 rounded bg-[#e3d7c5]" />
      </div>
      <div className="mt-auto space-y-3">
        <div className="h-4 w-16 rounded bg-[#e3d7c5]" />
        <div className="h-10 w-full rounded-md bg-[#e3d7c5]" />
      </div>
    </div>
  );
}

export function BatchGridSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
