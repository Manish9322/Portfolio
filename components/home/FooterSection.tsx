import Link from "next/link";
import { useGetProfileQuery } from "@/services/api";

export const FooterSection = () => {
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profileData?.name || "Manish sonawane"}.
            All rights reserved.
          </p>
        </div>
      </footer>
  );
};

export default FooterSection;