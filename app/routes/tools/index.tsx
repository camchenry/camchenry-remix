import PageCard from "../../components/PageCard";
import React from "react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Container, H1, H3 } from "../../components/styled";
import { defaultMeta } from "../../meta";

export const loader: LoaderFunction = async () => {
  return {};
};

export const meta: MetaFunction = () => {
  return { ...defaultMeta, title: `Tools | ${defaultMeta.title}` };
};

export default function ToolsIndex() {
  return (
    <Container>
      <H1 className="mb-4">Tools</H1>
      <ul className="flex flex-col space-y-4">
        <li>
          <PageCard
            title="Simple Wealth Tools"
            summary="Helpful tools for managing your personal finances and growing your wealth."
            url="https://simplewealthtools.com"
          />
        </li>
        <li>
          <PageCard
            title="CacheCheck"
            summary="Check the HTTP caching headers for any website. Type in a URL to learn the details of how the HTTP caching for the page works and whether it will be cached or not."
            url="https://cachecheck.net"
          />
        </li>
        <li>
          <PageCard
            title="Is It Worth It To Automate?"
            summary="This calculator helps to determine whether it saves times or wastes time to prematurely optimize a process with automation."
            url="/tools/worth-it-to-automate"
          />
        </li>
      </ul>
    </Container>
  );
}
