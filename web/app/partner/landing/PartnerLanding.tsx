"use client";

import styles from "./landing.module.css";
import { Hero } from "./Hero";
import { WorkspaceIntro } from "./WorkspaceIntro";
import { Features } from "./Features";
import { Workflow } from "./Workflow";
import { Pricing } from "./Pricing";
import { EnterpriseFlow } from "./EnterpriseFlow";
import { PartnerSection } from "./PartnerSection";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";

export function PartnerLanding({
  onStart,
  onBrowse,
  onLogin,
}: {
  onStart: () => void;
  onBrowse: () => void;
  onLogin: () => void;
}) {
  return (
    <div className={styles.root}>
      <Hero onStart={onStart} onBrowse={onBrowse} />
      <WorkspaceIntro />
      <Features />
      <Workflow />
      <Pricing onStart={onStart} />
      <EnterpriseFlow />
      <PartnerSection />
      <FAQ />
      <FinalCTA onStart={onStart} onLogin={onLogin} />
    </div>
  );
}
