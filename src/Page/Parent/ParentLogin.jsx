import { Link } from "react-router-dom";
import acewallshort from "../../assets/acewallshort.png";
import Footer from "@/CustomComponent/Footer";
import { useContext, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Eye, EyeClosed } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

// Validation Schema using Zod
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const parentLogin = () => {
  const { login, checkAuth } = useContext(GlobalContext);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await axiosInstance
        .post("auth/loginGuardianAcc", {
          guardianEmail: formData.email,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error(
            err?.response?.data?.message || "Login failed. Please try again."
          );
        });

      setLoginError("");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      console.error(errorMessage);
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            aria-label="Return to homepage"
            className="text-sm md:text-base"
          >
            Return to Home
          </Link>

          <Link
            to="/home"
            aria-label="Create an account"
            className="text-sm md:text-base"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1
            className="text-center text-2xl md:text-3xl text-gray-800 font-normal mb-8"
            id="Parent-login-heading"
          >
            Parent Login Page
          </h1>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Login Form */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-labelledby="Parent-login-heading"
              >
                {/* Email Field */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-600 mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />

                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-xs text-red-600 inline-block"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {loginError && (
                  <p className="text-sm text-red-500 mb-4" role="alert">
                    {loginError}
                  </p>
                )}

                {/* Buttons and Links */}
                <div className="space-y-12">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/TeacherLogin"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Teacher
                        </Link>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/Login"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Student
                        </Link>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded transition-colors duration-200"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Testimonial Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32">
                  <img src={acewallshort} alt="Acewall Scholars logo" />
                </div>
              </div>

              <h2 className="text-xl text-gray-800 font-medium mb-2 text-center md:text-left">
                Parents Love Acewall Scholars
              </h2>

              <blockquote className="text-gray-600 mb-4 text-center md:text-left">
                "This is one of the best Learning Management Platforms. Their
                support team is top-notch. The platform also supports various
                integrations as resources for classroom setup. I really enjoy
                making residual income from the classes I create."
              </blockquote>

              <div className="text-center md:text-left">
                <p className="font-medium text-gray-800">- Regina</p>
                <p className="text-gray-600 font-medium">Parent</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default parentLogin;
