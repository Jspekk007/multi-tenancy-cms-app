import './PasswordStrength.scss';

import { useMemo } from 'react';

import { validatePassword } from '@/utils/passwordValidation';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrength = ({
  password,
  showRequirements = true,
}: PasswordStrengthProps): JSX.Element => {
  const validation = useMemo(() => validatePassword(password), [password]);

  return (
    <div className="password-strength-wrapper">
      <div className="password-strength-bar">
        <span
          className={`password-strength-bar__segment ${validation.strength}`}
          style={{ width: `${validation.score * 20}%` }}
          role="progressbar"
          aria-valuenow={validation.score}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`Password strength: ${validation.strength}`}
        />
      </div>

      <p className="password-strength-text">
        Strength: <span className={`strength-${validation.strength}`}>{validation.strength}</span>
      </p>

      {showRequirements && (
        <ul className="password-requirements" role="list">
          {validation.requirements.map((requirement) => (
            <li
              key={requirement.id}
              className={`password-requirements__item ${requirement.isMet ? 'met' : 'unmet'}`}
              role="listitem"
            >
              <span className="password-requirements__checkbox">
                {requirement.isMet ? '✓' : '○'}
              </span>
              <span className="password-requirements__label">{requirement.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
