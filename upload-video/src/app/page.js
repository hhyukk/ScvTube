import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <nav>
        <Link href="/" className="logo">Wetube</Link>
        <Link href="/">Home</Link>
        <Link href="/sign-up">Sign up</Link>
        <Link href="/login">Login</Link>
        <Link href="/search">Search</Link>
        <Link href="/upload">Upload Video</Link>
      </nav>
      <div className="container">
        <h1>Welcome to WeTube</h1>
        <p>Upload and watch videos easily!</p>
      </div>
    </div>
  );
}
