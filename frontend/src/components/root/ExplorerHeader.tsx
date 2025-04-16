import React from "react";
import { Button } from "../ui/button";

const ExplorerHeader = ({
  title,
  showBackButton,
  onBackClick,
  children,
}: ExplorerHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackClick}
            className="mr-2"
            aria-label="Navigate back"
          >
            Back
          </Button>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default ExplorerHeader;
