import dynamic from "next/dynamic";

export const metadata = { title: "Speed Run" };

const SpeedClient = dynamic(() => import("./SpeedClient"), { ssr: false });

export default function Page() {
  return <SpeedClient />;
}
