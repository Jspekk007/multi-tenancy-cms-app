export const FormLabel = ({ required = false, children, ...props }) => {
    return (<label {...props} className={`form-label ${props.className || ''}`}>
      {children}
      {required && (<span aria-hidden="true" className="form-label-required">
          *
        </span>)}
    </label>);
};
//# sourceMappingURL=FormLabel.js.map