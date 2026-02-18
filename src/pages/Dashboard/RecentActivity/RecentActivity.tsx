import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion';
import { EnterpriseFeatureNotice } from '@/components/EnterpriseFeatureNotice';
import { useDashboardStore } from '@/store/dashboard';
import { motion } from 'motion/react';

export const RecentActivity = () => {
  const hasDashboardData = useDashboardStore((state) => state.dashboardData !== null);

  if (!hasDashboardData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Accordion type="single" collapsible defaultValue="events">
        <AccordionItem value="events">
          <AccordionTrigger
            className="hover:[&_svg]:text-success items-center hover:cursor-pointer"
            chevronClassName="[&_svg]:rotate-0 [&[data-state=open]>svg]:rotate-[180deg]"
            chevronPosition="right"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-success h-2 w-2 rounded-full" />
                <div className="bg-success absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75" />
              </div>
              <h2 className="text-default text-lg font-medium">Recent Activity</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <EnterpriseFeatureNotice
                className="max-w-[100%]"
                description="This functionality is not supported in the open-source version of DetectFlow"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};
