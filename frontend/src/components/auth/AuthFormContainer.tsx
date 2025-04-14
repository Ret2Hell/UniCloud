import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthFormContainer = ({ children }: LayoutProps) => (
  <div className="p-10 w-md rounded-md bg-white shadow-lg relative">
    <div className="absolute -top-14 -right-14 -z-50">
      <Image src="bg-1.svg" alt="UniCloud" width={150} height={150} />
    </div>
    <div className="absolute -bottom-22 -left-15 -z-50">
      <Image src="bg-2.svg" alt="UniCloud" width={250} height={250} />
    </div>
    <div className="flex flex-col">
      <Link href="/" className="flex items-center justify-center">
        <Image src="logo.svg" alt="UniCloud" width={32} height={32} />
        <span className="ml-1 text-3xl font-bold text-slate-700">UniCloud</span>
      </Link>

      {children}
    </div>
  </div>
);

export default AuthFormContainer;
