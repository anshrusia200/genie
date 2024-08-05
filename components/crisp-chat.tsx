"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("afef90d8-463e-4cfe-8dfd-127721158349");
  }, []);

  return null;
};
