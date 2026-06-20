import { Button } from '@/components/primitives/button/Button';

interface SidebarCreateActionProps {
  isCollapsed: boolean;
}

export const SidebarCreateAction: React.FC<SidebarCreateActionProps> = ({ isCollapsed }) => {
  return (
    <div className="sidebar-create">
      <Button
        variant="primary"
        href="/content/new"
        icon="add"
        iconVariant="primary"
        size={isCollapsed ? 'small' : 'medium'}
        ariaLabel="Create new content"
        iconOnly={isCollapsed}
      >
        {isCollapsed ? null : 'New Content'}
      </Button>
    </div>
  );
};
