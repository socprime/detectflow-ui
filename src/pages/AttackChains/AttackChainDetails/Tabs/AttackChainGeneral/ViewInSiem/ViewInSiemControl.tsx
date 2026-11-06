import { GlobeIcon, Loader2Icon } from 'lucide-react';
import { FC, ReactElement } from 'react';
import { ViewInSiemState } from '../../../hooks';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
} from '@socprime/react-ui';
import { usePermissions } from '@/hooks';


const MISSING_SIGMA_RULE_MESSAGE = 'Sigma rule ID is not available for this rule';
const VIEWER_ROLE_MESSAGE = 'This functionality is not available under your Viewer role';
const NO_SIEM_INTEGRATION_MESSAGE =
  'No SIEM integration with View in SIEM is configured. Add one in Settings → Integrations.';

interface ViewInSiemControlProps {
  viewInSiem: ViewInSiemState;
  scope?: 'chain' | 'rule';
  sigmaRuleId?: string;
  variant?: 'button' | 'icon';
}

const DisabledTooltipWrap: FC<{
  disabled: boolean;
  content: string;
  fullWidth?: boolean;
  children: ReactElement;
}> = ({ disabled, content, fullWidth, children }) => {
  if (!disabled) {
    return children;
  }

  return (
    <Tooltip content={content} className="max-w-[280px]">
      <span className={fullWidth ? 'inline-flex w-full' : 'inline-flex'}>{children}</span>
    </Tooltip>
  );
};

export const ViewInSiemControl: FC<ViewInSiemControlProps> = ({
  viewInSiem,
  scope = 'chain',
  sigmaRuleId,
  variant = 'button',
}) => {
  const { isViewer } = usePermissions();
  const { profiles, isDisabled, isBusy, openInSiem, hasMultipleProfiles, singleProfile } =
    viewInSiem;

  const isRuleActionBlocked = scope === 'rule' && !sigmaRuleId;
  const isControlDisabled = isDisabled || isRuleActionBlocked || isBusy;
  const disabledTooltip = isViewer
    ? VIEWER_ROLE_MESSAGE
    : isRuleActionBlocked
      ? MISSING_SIGMA_RULE_MESSAGE
      : NO_SIEM_INTEGRATION_MESSAGE;

  const handleSelectIntegration = (integrationId: string) => {
    void openInSiem(integrationId, sigmaRuleId);
  };

  const handleDirectOpen = () => {
    if (singleProfile) {
      void openInSiem(singleProfile.id, sigmaRuleId);
    }
  };

  const loadingIcon = isBusy ? <Loader2Icon className="size-3.5 animate-spin" /> : null;

  const menuItems = profiles.map((profile) => (
    <DropdownMenuItem
      key={profile.id}
      className="flex flex-col items-start gap-0 text-xs"
      disabled={isBusy}
      onSelect={() => handleSelectIntegration(profile.id)}
    >
      {profile.name}
      <div className="text-2xs text-dark-gray">{profile.integration_type_display}</div>
    </DropdownMenuItem>
  ));

  const buttonContent =
    variant === 'button' ? (
      <>
        {loadingIcon}
        View in SIEM
      </>
    ) : (
      (loadingIcon ?? <GlobeIcon className="size-4" />)
    );

  const renderTrigger = (asDropdownTrigger: boolean) => {
    const button = (
      <Button
        className={variant === 'button' ? 'w-full text-xs' : undefined}
        variant={variant === 'button' ? 'secondary' : 'icon'}
        size={variant === 'button' ? 'm' : 's'}
        type={asDropdownTrigger ? undefined : 'button'}
        disabled={isControlDisabled}
        onClick={asDropdownTrigger ? undefined : handleDirectOpen}
      >
        {buttonContent}
      </Button>
    );

    if (variant === 'icon' && !isControlDisabled) {
      return (
        <Tooltip content="View in SIEM">
          {asDropdownTrigger ? (
            <DropdownMenuTrigger asChild disabled={isControlDisabled}>
              {button}
            </DropdownMenuTrigger>
          ) : (
            button
          )}
        </Tooltip>
      );
    }

    if (asDropdownTrigger) {
      return (
        <DropdownMenuTrigger asChild disabled={isControlDisabled}>
          {button}
        </DropdownMenuTrigger>
      );
    }

    return button;
  };

  const control = hasMultipleProfiles ? (
    <DropdownMenu>
      {renderTrigger(true)}
      <DropdownMenuContent
        className={
          variant === 'button'
            ? 'border-border bg-secondary w-(--radix-dropdown-menu-trigger-width)'
            : 'border-border bg-secondary w-44'
        }
        align={variant === 'button' ? 'start' : 'end'}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    renderTrigger(false)
  );

  return (
    <DisabledTooltipWrap
      disabled={isControlDisabled}
      content={disabledTooltip}
      fullWidth={variant === 'button'}
    >
      {control as ReactElement}
    </DisabledTooltipWrap>
  );
};
