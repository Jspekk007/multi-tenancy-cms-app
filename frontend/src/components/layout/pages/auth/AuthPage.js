import './AuthPage.scss';
import { FormFactory } from '@/components/base/form/form-factory/FormFactory';
import { Logo } from '@/components/base/logo/Logo';
export const AuthPage = ({ title, fields, schema, onSubmit, error, isLoading, }) => {
    return (<div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo-wrapper">
          <Logo assetType="symbol" size="large"/>
        </div>
        {title && <h2 className="auth-title">{title}</h2>}
        {error && <div className="auth-error">{error}</div>}
        <FormFactory onSubmit={onSubmit} fields={fields} schema={schema} isLoading={isLoading}/>
        {title?.includes('Login') && (<div className="auth-footer">
            <p>
              Don't have an account? <a href="register">Register here</a>
            </p>
            <p>
              Forgot your password? <a href="/forgot-password">Reset it</a>
            </p>
          </div>)}
        {title?.includes('Register') && (<div className="auth-footer">
            Already have an account? <a href="/login">Login here</a>
          </div>)}
        {title?.includes('Forgot') && (<div className="auth-footer">
            Remembered your password? <a href="/login">Login here</a>
          </div>)}
      </div>
    </div>);
};
//# sourceMappingURL=AuthPage.js.map