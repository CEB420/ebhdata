import Image from "next/image";
import hero from "../../public/hero.jpg";

// "League of Legends World Championship Finals 2018" by Richard Ye, CC BY 2.0,
// via Wikimedia Commons. Modified: resized, desaturated and tinted blue.
const CREDIT = {
  title: "League of Legends World Championship Finals 2018",
  source: "https://commons.wikimedia.org/wiki/File:League_of_Legends_World_Championship_Finals_2018.jpg",
  author: "Richard Ye",
  license: "CC BY 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
};

/** Light hero: the Worlds 2018 stadium, tinted into the brand blue and washed out toward white. */
export function HeroPhoto({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden pt-[66px]">
      <div aria-hidden="true" className="absolute inset-0 bg-[#dfe5ff]">
        <Image
          src={hero}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[50%_62%] opacity-60 mix-blend-multiply [filter:grayscale(1)_brightness(1.55)_contrast(0.85)]"
        />
        {/* Blue tint, then fade to white at the top (behind the text) and at the bottom (into the page) */}
        <div className="absolute inset-0 bg-primary/45 mix-blend-color" />
        <div className="absolute inset-0 bg-[#dce3ff]/30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0.92)_30%,rgba(255,255,255,0.55)_52%,rgba(255,255,255,0)_74%,rgba(255,255,255,0.15)_88%,#ffffff_100%)]" />
      </div>
      {children}
      <p className="t-xs absolute right-4 bottom-3 z-10 text-gray-2/80 md:right-6">
        Photo:{" "}
        <a href={CREDIT.source} className="underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
          {CREDIT.author}
        </a>
        ,{" "}
        <a href={CREDIT.licenseUrl} className="underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
          {CREDIT.license}
        </a>
        , tinted
      </p>
    </div>
  );
}
