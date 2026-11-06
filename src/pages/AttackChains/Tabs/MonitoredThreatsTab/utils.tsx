import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@/models/router';

export const renderDescriptionWithPipelineAddLink = (description?: string) => {
  if (!description) {
    return null;
  }

  return description.split(/(\bAdd\b)/).map((part, index) =>
    part === 'Add' ? (
      <Link
        key={index}
        to={routes.pipelines}
        className="text-success hover:underline"
        target="_blank"
      >
        Add
      </Link>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
};
