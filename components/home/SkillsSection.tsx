import { useGetSkillsQuery } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillGroup {
  _id: string;
  category: string;
  items: string[];
  order: number;
}

export const SkillsSection = () => {
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkillsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Sort skills by order field
  const sortedSkills = skillsData
    ? [...skillsData].sort((a: SkillGroup, b: SkillGroup) => a.order - b.order)
    : [];

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-5 w-16" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-muted/50 dark:bg-muted/20 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Technical Expertise
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            My Personal Skills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Things I've practiced and improved over time.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingSkills ? (
            <>
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </>
          ) : sortedSkills && sortedSkills.length > 0 ? (
            sortedSkills.map((skillGroup: SkillGroup) => (
              <Card key={skillGroup._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No skills found</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;