import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Loader, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { CourseContext } from "@/Context/CoursesProvider";
import CategorySelect from "@/CustomComponent/CreateCourse/CategorySelect";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import SubCategorySelect from "@/CustomComponent/CreateCourse/SubCategorySelect";
import TeachingPointInput from "@/CustomComponent/CreateCourse/TeachingPoints";
import RequirementInput from "@/CustomComponent/CreateCourse/Requirment";
import DateRangePicker from "@/CustomComponent/CreateCourse/DateRangePicker";
import SelectSemAndQuar from "@/CustomComponent/CreateCourse/SelectSemester";
import SelectSemester from "@/CustomComponent/CreateCourse/SelectSemester";
import SelectQuarter from "@/CustomComponent/CreateCourse/SelectQuarter";
import SubCategorySelect_createCourse from "@/CustomComponent/CreateCourse/SelectSubcategory-createCourse";
import SelectCategory_createCourse from "@/CustomComponent/CreateCourse/SelectCategory-createCourse";



const courseFormSchema = z.object({
  thumbnail: z.any().refine((file) => file instanceof File, {
    message: "Thumbnail is required",
  }),
  courseTitle: z
    .string()
    .min(1, { message: "Course title must be at least 5 characters" })
    .max(100, { message: "Course title must be less than 100 characters" }),
  category: z
    .string({
      required_error: "Please select a category",
    })
    .refine((val) => val !== "", { message: "Please select a category" }),
  subcategory: z
    .string({
      message: "Please select a subcategory",
    })
    .refine((val) => val !== "", { message: "Please select a subcategory" }),
  semester: z
    .array(z.string().nonempty({ message: "Please select a semester" }))
    .min(1, { message: "Please select a semester" }),
  quarter: z
    .array(z.string().nonempty({ message: "Please select a quarter" }))
    .min(1, { message: "Please select a quarter" }),

  language: z
    .string()
    .nonempty({ message: "Please select a language" })
    .refine((val) => val !== "", { message: "Please select a language" }),
  courseDescription: z
    .string()
    .min(1, { message: "Description must be at least 5 characters" })
    .max(4000, { message: "Description must be less than 500 characters" }),
  teachingPoints: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, { message: "Teaching point must be at least 5 characters" })
          .max(120, {
            message: "Teaching point must be less than 120 characters",
          }),
      })
    )
    .min(1, { message: "Add at least one teaching point" }),
  requirements: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, { message: "Requirement must be at least 5 characters" })
          .max(120, {
            message: "Requirement must be less than 120 characters",
          }),
      })
    )
    .min(1, { message: "Add at least one requirement" }),

  syllabus: z
    .any()
    .refine((file) => file instanceof File && file.type === "application/pdf", {
      message: "Please upload a valid PDF file.",
    }),

})


export default function CoursesBasis() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(GlobalContext);
  const { course, setCourse } = useContext(CourseContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");

  useEffect(() => {
    axiosInstance
      .get("subcategory/get")
      .then((res) => {
        console.log("subcategroy", res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get("category/get")
      .then((res) => {
        console.log("category", res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseTitle: "",
      category: "",
      subcategory: "",
      language: "english",
      courseDescription: "",
      teachingPoints: [{ value: "" }],
      requirements: [{ value: "" }],
      syllabus: null,
    },
  });
  const watchedLanguage = watch("language");

  console.log(errors, "errors");

  // Set up field arrays for teaching points and requirements,
  const {
    fields: teachingPointsFields,
    append: appendTeachingPoint,
    remove: removeTeachingPoint,
  } = useFieldArray({
    control,
    name: "teachingPoints",
  });

  const {
    fields: requirementsFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed.");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setValue("thumbnail", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    console.log(data, "data");
    const formData = new FormData();
    setLoading(true);

    try {
      formData.append("thumbnail", data.thumbnail);
      formData.append("courseTitle", data.courseTitle);
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory);
      formData.append("language", data.language);
      formData.append("courseDescription", data.courseDescription);
      formData.append(
        "semester",
        JSON.stringify(data.semester.map((sem) => sem))
      );
      formData.append("quarter", JSON.stringify(data.quarter.map((q) => q)));
      formData.append(
        "teachingPoints",
        JSON.stringify(data.teachingPoints.map((tp) => tp.value))
      );
      formData.append(
        "requirements",
        JSON.stringify(data.requirements.map((req) => req.value))
      );
      formData.append("syllabus", data.syllabus);

      // formData.append("courseDate", JSON.stringify(data.courseDate));

      const res = await axiosInstance.post("/course/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Dismiss loading toast and show success
      toast.success(res.data.message || "Course created successfully!");

      reset();
      navigate("/teacher/courses");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error("Please fill out all required fields correctly.");
    console.log(errors);
  };

  return (
    <div>
      <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        Create Course
      </p>
      <FormProvider
        {...{
          register,
          handleSubmit,
          control,
          setValue,
          reset,
          formState: { errors, isSubmitting },
          watch,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
          <section>
            <div className="space-y-6">
              <div>
                <Label htmlFor="thumbnail" className="block mb-2">
                  Thumbnail *
                </Label>
                <div
                  className={` p-1 w-full max-w-md ${errors.thumbnail ? "border-red-500" : "border-gray-300"
                    }`}
                ></div>
                {errors?.thumbnail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.thumbnail.message}
                  </p>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-md p-1 w-full max-w-md">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview || "/placeholder.svg"}
                        alt="Course thumbnail"
                        className="w-full h-[300px] object-cover rounded"
                      />
                      <div className="absolute bottom-2 right-2 flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="bg-white hover:bg-gray-100 text-red-500"
                          onClick={() => {
                            setThumbnailPreview(null);
                            setValue("thumbnail", null); // Reset form value
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : loading ? (
                    <section className="flex justify-center items-center h-[300px]">
                      <Loader size={48} className="animate-spin" />
                    </section>
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        className="hidden"
                        id="thumbnailInput"
                        onChange={handleThumbnailChange}
                      />
                      <label htmlFor="thumbnailInput">
                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all cursor-pointer">
                          <Upload size={16} />
                          Upload Thumbnail
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="courseTitle" className="block mb-2">
                    Course Title *
                  </Label>
                  <Input
                    id="courseTitle"
                    maxLength={50}
                    className={`bg-gray-50 ${errors.courseTitle ? "border border-red-500" : ""
                      }`}
                    {...register("courseTitle")}
                  />
                  {errors.courseTitle && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.courseTitle.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <SelectCategory_createCourse
                  register={register}
                  errors={errors}
                  onCategoryChange={(value) => setSelectedCategory(value)}
                />

                <SubCategorySelect_createCourse
                  register={register}
                  errors={errors}
                  selectedCategory={selectedCategory}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectSemevster
                  register={register}
                  errors={errors}
                  selectedSemester={selectedSemester}
                  setSelectedSemester={setSelectedSemester}
                />
                <SelectQuarter
                  register={register}
                  errors={errors}
                  selectedSemester={selectedSemester}
                />
              </div>
              {/* <div>
                <DateRangePicker name="courseDate" />
              </div> */}
              <div>
                <Label htmlFor="language" className="block mb-2">
                  Language *
                </Label>
                <Select
                  onValueChange={(value) => {
                    console.log(value, "language");
                    setValue("language", value, { shouldValidate: true });
                  }}
                  value={watchedLanguage}
                  className="max-w-xs"
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue
                      placeholder="Select language"
                      defaultValues={"english"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>

              <div className="">
                <Label htmlFor="courseDescription" className="block mb-2">
                  Course Description *
                </Label>
                <Textarea
                  id="courseDescription"
                  className={`min-h-[100px] bg-gray-50  ${errors.courseDescription ? "border border-red-500" : ""
                    }`}
                  maxLength={4000}
                  {...register("courseDescription")}
                />
                {errors.courseDescription && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.courseDescription.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {`Characters left: ${4000 - (watch("courseDescription")?.length || 0)}`}
                </p>
              </div>
            </div>

            <div className="mt-10 mb-6">
              <h2 className="text-xl font-semibold">Make The Course</h2>
            </div>
            <section className="my-4">
              <h3 className="text-lg font-medium mb-4">
                What you will teach in this course *
                <span className="text-gray-500 text-xs"></span>
              </h3>
              {teachingPointsFields.map((field, index) => (
                <TeachingPointInput
                  key={field.id}
                  field={field}
                  index={index}
                  teachingPointsFields={teachingPointsFields}
                  remove={removeTeachingPoint}
                  error={errors.teachingPoints?.[index]?.value}
                  control={control}
                  register={register}
                />
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={teachingPointsFields.length >= 10}
                  onClick={() => appendTeachingPoint({ value: "" })}
                  className={`mt-2 text-blue-500 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50 ${teachingPointsFields.length >= 10
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  + Add Teaching Point
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-4">
                Course Requirements *
                <span className="text-gray-500 text-xs"></span>
              </h3>
              {requirementsFields.map((field, index) => (
                <RequirementInput
                  key={field.id}
                  field={field}
                  index={index}
                  requirementsFields={requirementsFields}
                  remove={removeRequirement}
                  error={errors.requirements?.[index]?.value}
                  register={register}
                />
              ))}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => appendRequirement({ value: "" })}
                  className={`mt-2 text-blue-500 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50 ${requirementsFields.length >= 10
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  disabled={requirementsFields.length >= 10}
                >
                  + Add Requirement
                </button>
              </div>
            </section>
          </section>

          <div>
            <Label htmlFor="syllabus" className="block mb-2">
              Upload Syllabus (PDF) *
            </Label>
            <input
              type="file"
              id="syllabus"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.type !== "application/pdf") {
                  toast.error("Only PDF files are allowed.");
                  return;
                }

                setValue("syllabus", file, { shouldValidate: true });
              }}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />
            {errors?.syllabus && (
              <p className="text-xs text-red-500 mt-1">
                {errors.syllabus.message}
              </p>
            )}
          </div>


          <div className="flex justify-end mt-25">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 "
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}