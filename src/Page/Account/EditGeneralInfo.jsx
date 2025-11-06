"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BackButton from "@/CustomComponent/BackButton";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  Bio: z.string().optional(),
  pronoun: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email("Invalid email address"),
  homeAddress: z.string().min(1, "Home address is "),
  mailingAddress: z.string().optional(),
});

const EditGeneralInfo = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const MAX_ADDRESS_LENGTH = 300;

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      Bio: "",
      pronoun: "",
      gender: "",
      email: "",
      homeAddress: "",
      mailingAddress: "",
    },

  });
  const {
    homeAddressLine1 = "",
    homeAddressLine2 = "",
    homeCity = "",
    homeState = "",
    homeZip = "",
    mailingAddressLine1 = "",
    mailingAddressLine2 = "",
    mailingCity = "",
    mailingState = "",
    mailingZip = "",
  } = watch();

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("middleName", user.middleName || "");
      setValue("Bio", user.Bio || "");
      setValue("lastName", user.lastName || "");
      setValue("pronoun", user.pronoun || "");
      setValue("gender", user.gender || "");
      setValue("email", user.email || "");
      setValue("homeAddress", user.homeAddress || "");
      setValue("mailingAddress", user.mailingAddress || "");

      // Split homeAddress into parts
      if (user.homeAddress) {
        const parts = user.homeAddress.split(",").map((p) => p.trim());
        setValue("homeAddressLine1", parts[0] || "");
        setValue("homeAddressLine2", parts[1] || "");
        setValue("homeCity", parts[2] || "");
        const stateZip = parts[3]?.split(" ");
        setValue("homeState", stateZip?.[0] || "");
        setValue("homeZip", stateZip?.[1] || "");
      }

      // Split mailingAddress into parts
      if (user.mailingAddress) {
        const parts = user.mailingAddress.split(",").map((p) => p.trim());
        setValue("mailingAddressLine1", parts[0] || "");
        setValue("mailingAddressLine2", parts[1] || "");
        setValue("mailingCity", parts[2] || "");
        const stateZip = parts[3]?.split(" ");
        setValue("mailingState", stateZip?.[0] || "");
        setValue("mailingZip", stateZip?.[1] || "");
      }
    }
  }, [user, setValue]);





  useEffect(() => {
    const fullHomeAddress = `${homeAddressLine1}, ${homeAddressLine2 ? homeAddressLine2 + ", " : ""
      }${homeCity}, ${homeState} ${homeZip}`;
    setValue("homeAddress", fullHomeAddress);
  }, [homeAddressLine1, homeAddressLine2, homeCity, homeState, homeZip]);

  // Concatenate Mailing Address
  useEffect(() => {
    const fullMailingAddress = `${mailingAddressLine1}, ${mailingAddressLine2 ? mailingAddressLine2 + " " : ""
      }${mailingCity}, ${mailingState} ${mailingZip}`;
    setValue("mailingAddress", fullMailingAddress);
  },
    [
      mailingAddressLine1,
      mailingAddressLine2,
      mailingCity,
      mailingState,
      mailingZip,
    ]
  );
  // Form submission handler
  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    if (data.middleName.length > 0) {
      formData.append("middleName", data.middleName);
    }
    formData.append("lastName", data.lastName);
    formData.append("Bio", data.Bio);
    formData.append("pronoun", data.pronoun);
    formData.append("gender", data.gender);
    formData.append("email", data.email);
    formData.append("homeAddress", data.homeAddress);
    formData.append("mailingAddress", data.mailingAddress);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    
    try {
      const response = await axiosInstance.put(`/auth/updateuser`, formData);
      toast.success(response.data.message);
      navigate(`/${user.role}/account`);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };


  return (

    <div className="w-full mx-auto p-4 sm:p-6 space-y-8">
      <BackButton className="mb-10" />
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Account Information
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          {/* Personal Information */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  maxLength={15}
                  placeholder="John"
                  {...register("firstName")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g);
                  }}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-sm font-medium">
                  Middle Name
                </Label>
                <Input
                  type="text"
                  name="middleName"
                  id="middleName"
                  maxLength={15}
                  placeholder="M."
                  {...register("middleName")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g);
                  }}
                />
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  maxLength={15}
                  placeholder="Doe"
                  {...register("lastName")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g);
                  }}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Bio */}
          {user?.role === "teacher" && (
            <section className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                name="bio"
                id="bio"
                placeholder="Write your bio here..."
                {...register("Bio")}
              />
              {errors.Bio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Bio.message}
                </p>
              )}
            </section>
          )}
          


          {/* Pronouns & Gender Selection */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold">Identity Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Pronouns */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Preferred Pronoun
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "He/Him",
                    "She/Her",
                    "They/Them",
                    "Others",
                    "prefer not to say",
                  ].map((pronoun, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`pronoun-${pronoun.toLowerCase()}`}
                        value={pronoun.toLowerCase()}
                        {...register("pronoun")}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <label
                        htmlFor={`pronoun-${pronoun.toLowerCase()}`}
                        className="text-sm text-gray-900 dark:text-white"
                      >
                        {pronoun}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Gender Identity
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Male",
                    "Female",
                    "Non-binary",
                    "Other",
                    "prefer not to say",
                  ].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`gender-${gender.toLowerCase()}`}
                        value={gender.toLowerCase()}
                        {...register("gender")}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <label
                        htmlFor={`gender-${gender.toLowerCase()}`}
                        className="text-sm text-gray-900 dark:text-white"
                      >
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold">Address Information</h3>
            {/* Home Address */}
            <div className="mb-6">
              <Label>Home Address</Label>

              <Input
                {...register("homeAddressLine1", {
                  required: "Address Line 1 is required",
                })}
                placeholder="Address Line 1"
                className="mt-2"
              />
              <p className="text-xs text-red-600">
                {errors?.homeAddressLine1?.message}
              </p>

              <Input
                {...register("homeAddressLine2")}
                placeholder="Address Line 2 (Optional)"
                className="mt-2"
              />

              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <Input
                    {...register("homeCity", { required: "City is required" })}
                    placeholder="City / Town"
                  />
                  <p className="text-xs text-red-600">{errors?.homeCity?.message}</p>
                </div>

                <div className="flex-1">
                  <Input
                    {...register("homeState", { required: "State is required" })}
                    placeholder="State / Province"
                  />
                  <p className="text-xs text-red-600">{errors?.homeState?.message}</p>
                </div>

                <div className="flex-1">
                  <Input
                    {...register("homeZip", { required: "ZIP Code is required" })}
                    placeholder="ZIP / Postal"
                  />
                  <p className="text-xs text-red-600">{errors?.homeZip?.message}</p>
                </div>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="mb-6">
              <Label>Mailing Address (if different)</Label>

              <Input
                {...register("mailingAddressLine1", {
                  required: "Address Line 1 is required",
                })}
                placeholder="Address Line 1"
                className="mt-2"
              />
              <p className="text-xs text-red-600">
                {errors?.mailingAddressLine1?.message}
              </p>

              <Input
                {...register("mailingAddressLine2")}
                placeholder="Address Line 2 (Optional)"
                className="mt-2"
              />

              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <Input
                    {...register("mailingCity", { required: "City is required" })}
                    placeholder="City / Town"
                  />
                  <p className="text-xs text-red-600">
                    {errors?.mailingCity?.message}
                  </p>
                </div>

                <div className="flex-1">
                  <Input
                    {...register("mailingState", { required: "State is required" })}
                    placeholder="State / Province"
                  />
                  <p className="text-xs text-red-600">
                    {errors?.mailingState?.message}
                  </p>
                </div>

                <div className="flex-1">
                  <Input
                    {...register("mailingZip", { required: "ZIP Code is required" })}
                    placeholder="ZIP / Postal"
                  />
                  <p className="text-xs text-red-600">
                    {errors?.mailingZip?.message}
                  </p>

                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditGeneralInfo;