import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonalInfo from "./StudentSignup/PersonalInfo";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./StudentSignup/AddressInfo";
import PasswordInfo from "./StudentSignup/PasswordInfo";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";

const steps = ["Personal Information", "Address Information", "Password Info"];

// Update password validation schema in zod
const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Phone number is required"),
    smsConsent: z.any(),
    homeAddress: z.string().optional(),
    mailingAddress: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /^(?=.*[#?!@$%^&*-])/,
        "Password must contain at least one special character"
      )
      .regex(/^(?!.*\s).*$/, "Password cannot contain spaces"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    signUpdata,
    setSignupData,
    signup,
    setUser,
    Authloading,
    setAuthLoading,
  } = useContext(GlobalContext);
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (signUpdata.email === undefined && signUpdata.role === undefined) {
      navigate("/");
    }
  }, []);

  const { handleSubmit, trigger, setValue, watch } = methods;

  const formData = watch(); // Get current form data

  console.log(watch("smsConsent"), "smsConsent");

  const onSubmit = async (formdata) => {
    const completeData = { ...signUpdata, ...formdata };

    setAuthLoading(true);
    try {
      const res = await axiosInstance.post("auth/register", completeData);
      toast.success(res.data.message);
      navigate(`/verifyOTP/${signUpdata.email}`);
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = {
      0: ["firstName", "lastName", "phone"],
      1: ["homeAddress", "mailingAddress"],
      2: ["password", "confirmPassword"],
    }[currentStep];

    const valid = await trigger(fieldsToValidate);

    if (valid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => {
      const previousStep = prev - 1;
      return previousStep;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <AddressInfo />;
      case 2:
        return <PasswordInfo />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] dark:bg-gray-900">
      <div className="bg-black/50 backdrop-blur-md h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white border border-gray-300 rounded-lg shadow-md sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <h2 className="mb-2 font-medium text-gray-900 dark:text-white">
                {steps[currentStep]}
              </h2>
              <FormProvider {...methods}>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {renderStep()}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevious}
                      type="button"
                      className={`text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-3 py-3 md:px-5 md:py-2.5 ${
                        currentStep === 0 ? "invisible" : ""
                      }`}
                    >
                      Previous
                    </button>

                    {currentStep === steps.length - 1 ? (
                      <button
                        type="submit"
                        disabled={!watch("agreeToTerms")}
                        className={`text-white font-medium rounded-lg text-sm px-3 py-3 md:px-5 md:py-2.5 ${
                          watch("agreeToTerms")
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Create Account
                      </button>
                    ) : (
                      <button
                        disabled={!watch("smsConsent")}
                        className={`text-white font-medium rounded-lg text-sm px-3 py-3 md:px-5 md:py-2.5 ${
                          watch("smsConsent")
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        type="button"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </form>
              </FormProvider>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;