/** Short gradient header with the inner-page H1. */
export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="wash-short pt-[66px]">
      <div className="container-page pt-16 pb-14 text-center md:pt-24 md:pb-20">
        <h1 className="t-h1 mx-auto max-w-[860px]">{title}</h1>
        {sub && <p className="subline t-md mt-5">{sub}</p>}
      </div>
    </div>
  );
}
