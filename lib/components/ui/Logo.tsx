import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  width?: number;
  height?: number;
};

export function Logo({ width = 96, height = 96 }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Go to home page">
      <Image src="/logo.png" alt="PaniniHead" width={width} height={height} priority />
    </Link>
  );
}
