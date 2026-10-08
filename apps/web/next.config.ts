import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

import { withPwa } from "./pwa.config";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  typedRoutes: true,
  reactCompiler: true,
};

export default withVarlock(withPwa(nextConfig));
