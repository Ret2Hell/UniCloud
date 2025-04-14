import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const FormNavigation = ({
  mainActionLabel,
  secondaryAction,
  isLoading,
}: FormNavigationProps) => (
  <div className="flex items-center justify-between">
    <Link href={secondaryAction.href}>
      <Button variant="link" className="text-[#797be9] hover:text-[#696cff]">
        {secondaryAction.label}
      </Button>
    </Link>
    <Button
      className="w-2/5"
      type="submit"
      disabled={isLoading}
      aria-label={isLoading ? "Processing..." : mainActionLabel}
    >
      {isLoading ? "Loading..." : mainActionLabel}
    </Button>
  </div>
);

export default FormNavigation;
