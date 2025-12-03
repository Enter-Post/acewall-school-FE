import SignupForm from "../CustomComponent/SignupForm";

export default function SignupPage() {
  return (
    <main
      className="
        w-screen 
        h-screen 
        bg-cover 
        bg-center 
        flex 
        items-center 
        justify-center
        bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
      "
      aria-label="Signup page background (decorative)"
      role="main"
    >
      <div className="bg-white/90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>

        {/* Your accessible form */}
        <SignupForm />
      </div>
    </main>
  );
}
