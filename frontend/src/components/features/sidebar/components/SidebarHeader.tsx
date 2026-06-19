import { Button } from '@/components/primitives/button/Button';
import { Logo, type LogoAssetType } from '@/components/primitives/logo/Logo';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, onToggle }) => {
  const logoAssetType: LogoAssetType = isCollapsed ? 'symbol' : 'wordmark';
  const toggleAriaLabel = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <div className="sidebar-header">
      <a href="/" aria-label="Go to homepage">
        <Logo assetType={logoAssetType} size="small" className="sidebar-logo" alt="ATLAS" />
      </a>
      <Button
        className="sidebar-toggle"
        variant="primary"
        size="small"
        icon="panel-left"
        iconVariant="secondary"
        iconOnly
        ariaLabel={toggleAriaLabel}
        aria-expanded={!isCollapsed}
        aria-pressed={isCollapsed}
        onClick={onToggle}
      />
    </div>
  );
};
