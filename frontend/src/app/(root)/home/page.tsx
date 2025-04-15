"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const HomePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const data = id ? `id: ${id}` : "No ID provided";
  console.log(data);

  return <div>HomePage</div>;
};

export default HomePage;
