"use client";

import { useEffect, useState } from "react";
import { Loader, Pen, Trash2 } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import avatar from "@/assets/avatar.png";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const maxSize = 5 * 1024 * 1024;
const MAX_DOCS = 4;



const Account = () => {
  const [user, setUser] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = () => {
    axiosInstance
      .get("auth/getUserInfo")
      .then((res) => setUser(res.data.user))
      .catch(console.log);
  };

  useEffect(() => {
    fetchUser();
  }, [loading]);

  const handleImg = async () => {
    if (!profileImg || !allowedTypes.includes(profileImg.type) || profileImg.size > maxSize) {
      toast.error("Invalid image. Use JPG/PNG/WebP under 5MB.");
      setProfileImg(null);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImg", profileImg);

    try {
      const res = await axiosInstance.put("auth/updateProfileImg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setProfileImg(null);
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };


  const displayField = (label, value) => (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-900 dark:text-white">{value || "—"}</p>
    </div>
  );


  return (
    <div className="w-full mx-auto p-4 sm:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Account Information</h2>
        {user?.role === "teacher" && user?.isVarified !== undefined && (
          <span
            className={`text-sm px-3 py-1 rounded-full ${user.isVarified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {user.isVarified ? "Verified" : "Not Verified"}
          </span>
        )}
      </div>

      {/* Profile Image */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Profile Image</h3>
        <div className="relative w-32 h-32 border border-gray-300 rounded-full overflow-hidden">
          <img
            src={profileImg ? URL.createObjectURL(profileImg) : user?.profileImg?.url ?? avatar}
            alt="Profile"
            className="w-full h-full object-cover rounded-full shadow-sm"
          />
          <label className="absolute bottom-5 right-4  bg-white border rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-100">
            <Pen className="w-4 h-4 text-gray-600" />
            <input
              type="file"
              className="hidden"
              accept={allowedTypes.join(",")}
              onChange={(e) => setProfileImg(e.target.files[0])}
            />
          </label>
        </div>
        {profileImg && (
          <div className="flex gap-2">
            <Button onClick={handleImg} className="bg-green-500 text-white hover:bg-green-600">
              {loading ? <Loader className="animate-spin w-4 h-4 mr-2" /> : "Save Changes"}
            </Button>
          </div>
        )}
      </section>

      {/* Edit Buttons */}
      <section className="flex gap-2 justify-end">
        <Link to={`/${user.role}/account/editGeneralInfo`}>
          <Button className="bg-green-500 text-white hover:bg-green-600">Edit Info</Button>
        </Link>
        <Link to={`/${user.role}/account/editCredentials`}>
          <Button className="bg-green-500 text-white hover:bg-green-600">Edit Credentials</Button>
        </Link>
      </section>

      {/* Info Sections */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayField("First Name", user?.firstName)}
          {displayField("Middle Name", user?.middleName)}
          {displayField("Last Name", user?.lastName)}
        </div>
      </section>
      {user?.role === "teacher" && (
        <section className="space-y-6">
          <h3 className="text-lg font-semibold">Bio</h3>
          <div className="grid grid-cols-1 gap-4">
            {displayField("Bio", user?.Bio)}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Identity Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayField("Preferred Pronouns", user?.pronoun)}
          {displayField("Gender Identity", user?.gender)}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayField("Email Address", user?.email)}
          {displayField("Phone Number", user?.phone)}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Address Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayField("Home Address", user?.homeAddress)}
          {displayField("Mailing Address", user?.mailingAddress)}
        </div>
      </section>



      {/* Teacher Documents */}

    </div>
  );
};

export default Account;
