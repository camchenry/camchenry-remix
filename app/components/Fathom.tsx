import { useLocation } from "@remix-run/react";
import { load, trackPageview } from "fathom-client";
import { useEffect } from "react";

export const Fathom = () => {
  const location = useLocation();

  useEffect(() => {
    load("HPHMYKVN", {
      includedDomains: ["camchenry.com"],
    });
  }, []);

  useEffect(() => {
    trackPageview();
  }, [location.pathname, location.search]);

  return null;
};
