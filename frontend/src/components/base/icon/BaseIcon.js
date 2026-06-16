import './BaseIcon.scss';
import { Icons } from './Icons';
export const BaseIcon = ({ icon, className = '', rotate, variant = 'default', title, ariaLabel, ...props }) => {
    const IconComponent = Icons[icon];
    const style = rotate ? { transform: `rotate(${rotate}deg)` } : undefined;
    return (<div className={`base-icon ${variant} ${className}`} style={style} role="img" aria-label={ariaLabel} title={title} {...props}>
      <IconComponent />
    </div>);
};
//# sourceMappingURL=BaseIcon.js.map