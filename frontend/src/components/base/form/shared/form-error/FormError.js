import './FormError.scss';
export const FormError = ({ message }) => {
    if (!message) {
        return null;
    }
    return (<p className="form-error" role="alert">
      {message}
    </p>);
};
//# sourceMappingURL=FormError.js.map