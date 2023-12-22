/* eslint-disable jsx-a11y/anchor-has-content */
/*
TODO: Update this component to use your client-side framework's link
component. We've provided examples of how to do this for Next.js,
Remix, and Inertia.js in the Catalyst documentation:

https://catalyst.tailwindui.com/docs#client-side-router-integration
*/

import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
import React from "react";

export const Link = React.forwardRef(
  (
    props: { href: string } & React.ComponentPropsWithoutRef<"a">,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => (
    <HeadlessDataInteractive>
      <a {...props} ref={ref} />
    </HeadlessDataInteractive>
  ),
);
