import Brand from './Brand';
import { CheckIcon } from './Icons';

const AuthAside = () => (
  <aside className="auth-aside">
    <Brand />
    <p className="auth-tagline">
      Less noise. <em>More done.</em>
    </p>
    <ul className="auth-preview" aria-hidden="true">
      <li className="auth-preview-done">
        <span className="auth-preview-box"><CheckIcon size={13} /></span>
        Plan the week
      </li>
      <li className="auth-preview-done">
        <span className="auth-preview-box"><CheckIcon size={13} /></span>
        Clear the inbox
      </li>
      <li>
        <span className="auth-preview-box" />
        Ship the next thing
      </li>
    </ul>
  </aside>
);

export default AuthAside;
