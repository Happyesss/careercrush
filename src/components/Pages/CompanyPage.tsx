"use client";

import { Button, Divider } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Company from "../CompanyProfile/Company";
import SimilarCompanies from "../CompanyProfile/SimilarCompanies";


const CompanyPage = () => {
  const router = useRouter();

  return (
  <div className="min-h-[100vh] bg-cape-cod-950 p-4">
      <Divider size="xs" />

      <Button
        leftSection={<IconArrowLeft size={20} />}
  onClick={() => router.back()}
        my="md"
        color="blue.4"
        variant="light"
      >Back</Button>

      <div className="flex gap-5">
        <Company/>
        <SimilarCompanies/>
      </div>
    </div>
  );
};

export default CompanyPage;
