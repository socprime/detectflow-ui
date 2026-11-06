import { useAccordionRepositories } from './useAccordionRepositories';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  HelperText,
  Label,
  Switch,
} from '@socprime/react-ui';
import { SyncProcessBar } from '@socprime/react-ui/domain';

interface AccordionRepositoriesProps {
  loading: boolean;
}

export const AccordionRepositories = ({ loading }: AccordionRepositoriesProps) => {
  const { repositoriesByType, syncProcessing, handleSyncChange } = useAccordionRepositories();

  return (
    <div>
      {syncProcessing && <SyncProcessBar />}
      <div className="border-border bg-secondary flex flex-col gap-4 rounded-lg border p-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-default text-sm font-medium">Available Repositories</h3>
          <p className="text-2xs text-gray-chateau">
            Content of each platform type in the SOC Prime Platform’s Custom Repository is presented
            as a separate repository in DetectFlow. Enable synchronization for each of them
            individually to pull content only for the platforms you need.
          </p>
        </div>
        <Accordion className="flex flex-col gap-4" type="multiple" defaultValue={['api']}>
          {Object.entries(repositoriesByType || {}).map(([type, repositories]) => (
            <AccordionItem
              className="border-border overflow-hidden rounded-sm border last:border-b-1"
              key={type}
              value={type}
            >
              <AccordionTrigger
                className="hover:bg-secondary items-center justify-between gap-6 p-3"
                chevronPosition="right"
              >
                <div className="flex flex-col">
                  <h6 className="text-default text-xs font-medium capitalize">
                    {type === 'api' ? 'Soc Prime' : type}
                  </h6>
                  <p className="text-gray-chateau text-2xs font-normal">
                    Sync {repositories?.some((repo) => repo.sync_enabled) ? 'On' : 'Off'}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-border bg-secondary border-t p-3">
                <div className="flex flex-col gap-3">
                  {repositories?.map((repo) => {
                    const switchId = `repo-sync-${repo.id}`;

                    return (
                      <div className="flex basis-1/2 items-center gap-3" key={repo.id}>
                        <Switch
                          disabled={loading}
                          id={switchId}
                          checked={repo.sync_enabled}
                          onCheckedChange={() => handleSyncChange(repo.id)}
                        />
                        <div className="flex items-center gap-1">
                          <Label htmlFor={switchId} className="text-subdued text-2xs">
                            {repo.name}
                          </Label>
                          <HelperText className="text-gray-chateau text-2xs break-all">
                            ({repo.rules})
                          </HelperText>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
