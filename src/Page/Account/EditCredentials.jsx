import { AppWindowIcon, CodeIcon, Eye, EyeClosed, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useState } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import VerifyOTPDialog from "@/CustomComponent/VerfyOTP-Dialog";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().max(50, "Password must be less than 50 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one digit")
      .regex(/[#?!@$%^&*-]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function EditCredentials() {
  const { user } = useContext(GlobalContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  //   console.log(sendingOTP, "sendingOTP");

  const newPassword = passwordForm.watch("newPassword") || "";
  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecialChar = /[#?!@$%^&*-]/.test(newPassword);
  const oldPassword = passwordForm.watch("oldPassword");
  const newPasswordValue = passwordForm.watch("newPassword");
  const confirmPassword = passwordForm.watch("confirmPassword");
  const isSameAsOld = oldPassword && newPasswordValue && oldPassword === newPasswordValue;

  const handleEmailSubmit = async (data) => {
    setSendingOTP(true);
    await axiosInstance
      .post("auth/updateEmailOTP", { newEmail: data.email })
      .then((res) => {
        toast.success(res.data.message);
        setIsOTPDialogOpen(true);
        setSendingOTP(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message);
        setSendingOTP(false);
      });
  };

  const handlePasswordSubmit = async (data) => {
    if (data.oldPassword === data.newPassword) {
      toast.error("New password must be different from the old password");
      return;
    }

    setSendingOTP(true);
    try {
      const res = await axiosInstance.post("auth/updatePasswordOTP", data);
      toast.success(res.data.message);
      setIsOTPDialogOpen(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSendingOTP(false);
    }
  };


  const getClass = (condition) =>
    `text-xs font-medium ${condition ? "text-green-600" : "text-red-500"}`;

  return (
    <section className="flex justify-center flex-col items-center h-full">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* Email Tab */}
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>
                    Make changes to your email here. Click save when you're
                    done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...emailForm.register("email")} />
                    {emailForm.formState.errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <VerifyOTPDialog
                    open={isOTPDialogOpen}
                    setOpen={setIsOTPDialogOpen}
                    type="email"
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

          {/* Password Tab */}
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Choose a password that you can remember,
                    and make sure its strong.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {/* Old password */}
                  <div className="grid gap-3 relative">
                    <Label htmlFor="oldPassword">Current password</Label>
                    <Input
                      id="oldPassword"
                      type={showPassword ? "text" : "password"}
                      {...passwordForm.register("oldPassword")}
                    />
                    {oldPassword && (
                      <button
                        type="button"
                        aria-label="Toggle current password visibility"
                        className="absolute right-2 top-9 text-xs"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                      </button>
                    )}

                    {passwordForm.formState.errors.oldPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        {passwordForm.formState.errors.oldPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New password */}
                  <div className="grid gap-3 relative">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...passwordForm.register("newPassword")}
                    />
                    {isSameAsOld && (
                      <p className="text-xs text-red-600 mt-1">
                        New password must be different from the old password.
                      </p>
                    )}

                    {newPasswordValue && (
                      <button
                        type="button"
                        aria-label="Toggle new password visibility"
                        className="absolute right-2 top-9 text-xs"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showNewPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                      </button>
                    )}

                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="grid gap-3 relative">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...passwordForm.register("confirmPassword")}
                      autoComplete="new-password"
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        className="absolute right-2 top-9 text-xs"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                      </button>
                    )}

                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Password rules */}
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mt-2 dark:text-gray-300">
                    <li className={getClass(isMinLength)}>
                      Minimum 8 characters
                    </li>
                    <li className={getClass(hasUppercase)}>
                      At least one uppercase letter
                    </li>
                    <li className={getClass(hasLowercase)}>
                      At least one lowercase letter
                    </li>
                    <li className={getClass(hasDigit)}>At least one digit</li>
                    <li className={getClass(hasSpecialChar)}>
                      At least one special character (#?!@$%^&*-)
                    </li>
                  </ol>
                </CardContent>
                <CardFooter>
                  <VerifyOTPDialog
                    open={isOTPDialogOpen}
                    setOpen={setIsOTPDialogOpen}
                    type="password"
                    sendingOTP={sendingOTP}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </section>
  );
}
