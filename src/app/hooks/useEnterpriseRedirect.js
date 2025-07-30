import { useRouter } from "next/navigation";

export const useEnterpriseRedirect = () => {
  const router = useRouter();

  const handleEnterpriseClick = () => {
    router.push("/enterprise");
  };

  const handlePlanSelection = (planId) => {
    if (planId === 3) {
      // Redirect to enterprise selection for plan 3
      router.push("/enterprise");
    } else {
      // Normal flow for other plans
      router.push(`/payments/${planId}`);
    }
  };

  return {
    handleEnterpriseClick,
    handlePlanSelection
  };
};