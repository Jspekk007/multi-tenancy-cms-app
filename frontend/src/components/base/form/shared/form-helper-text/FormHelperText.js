import './FormHelperText.scss';
export const FormHelperText = ({ id, children, ...props }) => {
    return (<div id={id} className={`form-helper-text ${props.className || ''}`} {...props}>
      {children}
    </div>);
};
//# sourceMappingURL=FormHelperText.js.map