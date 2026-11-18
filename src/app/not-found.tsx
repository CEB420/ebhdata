import { ButtonLink } from "@/components/Button";
import { SiteShell } from "@/components/Footer";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="wash-short pt-[66px]">
        <div className="container-page pt-24 pb-32 text-center">
          <p className="t-sm text-gray-2">404</p>
          <h1 className="t-h1 mt-3">Page not found</h1>
          <p className="subline t-md mt-5">This page doesn’t exist, or it moved.</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/" variant="dark">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
