import Link from 'next/link';

const AuthError = () => {
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>You are not authorized to view this page.</p>
      <Link href="/">Go back to the home page</Link>
    </div>
  );
};

export default AuthError;
