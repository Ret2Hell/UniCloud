import React from "react";

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <>
      <h4 className="mt-6 text-2xl font-medium text-slate-700">{title}</h4>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </>
  );
};

export default AuthHeader;
