import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { appName } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [{ text: "Open JMWired", url: "http://127.0.0.1:3001", external: true }],
  };
}
