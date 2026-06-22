"use client";

import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface AsButton extends BaseProps {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface AsLink extends BaseProps {
  href: string;
}

type Props = AsButton | AsLink;

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Button(props: Props) {
  const { variant = "primary", full, className, children, onClick } = props;
  const cls = cx(styles.btn, styles[variant], full && styles.full, className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const btn = props as AsButton;
  return (
    <button
      className={cls}
      type={btn.type ?? "button"}
      disabled={btn.disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
