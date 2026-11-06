import { FC } from 'react';
import type { IntegrationExtraSectionsProps } from '../integrationRegistry';
import { AccordionRepositories } from './AccordionRepositories';

export const TdmExtraSections: FC<IntegrationExtraSectionsProps> = ({ loading }) => (
  <AccordionRepositories loading={loading} />
);
