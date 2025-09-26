"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useState } from "react";
import { Loader, Mail, Phone, MapPin } from "lucide-react";
import BackButton from "./BackButton";

export default function FeaturedContantCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosInstance
        .post("contact/sendSchoolcontactmail", data)
        .then((response) => {
          console.log(response);
          setLoading(false);
          setSuccessMessage("✅ Your request has been sent successfully!");
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setLoading(false);
          setErrorMessage("❌ Error submitting form. Please try again.");
        });
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Error submitting form. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col items-center relative">
      {/* Back button fixed at top-left */}
      <div className="absolute top-6 left-6 ">
        <BackButton />
      </div>

      {/* Header Section */}
      <div className="max-w-3xl text-center py-12 px-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Get in Touch With Us
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          We’d love to hear from you! Whether you’re a school looking to
          streamline your learning process, or have questions about our LMS,
          our team is here to help.
        </p>
      </div>


      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-6 mb-12">
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <Mail className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Email Us</p>
          <span className="text-gray-600 text-sm">support@acewallscholars.org</span>
        </div>
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <Phone className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Call Us</p>
          <span className="text-gray-600 text-sm"> (855) 522-3925</span>
        </div>
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <MapPin className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Visit Us</p>
          <span className="text-gray-600 text-sm">Powhatan, VA 23139, United States</span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Contact Information
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {/* Organization Name */}
          <div>
            <label className="block font-medium">Organization Name</label>
            <input
              {...register("organization", {
                required: "Organization name is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter organization name"
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">
                {errors.organization.message}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block font-medium">Contact Person</label>
            <input
              {...register("contactPerson", {
                required: "Contact person is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact person name"
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-sm">
                {errors.contactPerson.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="tel"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block font-medium">Contact Email</label>
            <input
              type="email"
              {...register("contactEmail", { required: "Email is required" })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact email"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          {/* No of Teachers */}
          <div>
            <label className="block font-medium">No. of Teachers</label>
            <input
              type="number"
              {...register("teachers", {
                required: "Number of teachers is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter number of teachers"
            />
            {errors.teachers && (
              <p className="text-red-500 text-sm">{errors.teachers.message}</p>
            )}
          </div>

          {/* No of Students */}
          <div>
            <label className="block font-medium">No. of Students</label>
            <input
              type="number"
              {...register("students", {
                required: "Number of students is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter number of students"
            />
            {errors.students && (
              <p className="text-red-500 text-sm">{errors.students.message}</p>
            )}
          </div>

          {/* School Size */}
          <div>
            <label className="block font-medium">School Size</label>
            <select
              {...register("schoolSize", {
                required: "School size is required",
              })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select school size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            {errors.schoolSize && (
              <p className="text-red-500 text-sm">
                {errors.schoolSize.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block font-medium">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter full address"
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md"
            >
              {loading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </div>

          {successMessage && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-green-600 text-center font-medium">
                {successMessage}
              </p>
            </div>
          )}
          {errorMessage && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-red-600 text-center font-medium">
                {errorMessage}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
