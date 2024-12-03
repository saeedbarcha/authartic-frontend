"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Edit } from "@mui/icons-material";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useUploadAttachmentMutation } from "@/slices/uploadAttachmentApiSlice";
import {
  useUpdateProfileMutation,
  useGetProfileQuery,
} from "@/slices/userApiSlice";
import { useGetActiveCountriesQuery } from "@/slices/countriesApiSlice";
import sample from "@/assets/images/sample.svg";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WithAuth from "@/components/withAuth";

const AccountSettings = () => {
  // Define initialFormData as a constant to avoid recreating it on each render
  const initialFormData = React.useMemo(
    () => ({
      primary_content: "",
      phone: "",
      about_brand: "",
      country: null,
      other_links: ["", "", ""],
      newPickedImage: null,
      changedImageFile: null,
      user_name: "",
      social_media: ["", "", ""],
      website_url: "",
    }),
    []
  );

  const [subscriptionStatusName, setSubscriptionStatusName] = useState("None");
  const [editingField, setEditingField] = useState(null);

  const { data: activeCountries } = useGetActiveCountriesQuery();
  const { data: userProfile, refetch: userProfileRefetch } =
    useGetProfileQuery();
  const [updateUser, { isLoading: isUpdateLoading }] =
    useUpdateProfileMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();
  const uploadPicRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      toast.info(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          changedImageFile: file,
          newPickedImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFormDataChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (Object.keys(initialFormData).includes(name)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [initialFormData]
  );

  const handleCountryUpdate = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({ ...prev, country: Number(selectedCountry) }));
  };

  const handleSubmit = async () => {
    try {
      const uploadLogoData = new FormData();
      uploadLogoData.append("file", formData.changedImageFile);
      uploadLogoData.append("type", "text/photo");

      const uploadedLogo = formData.changedImageFile
        ? await uploadAttachment(uploadLogoData).unwrap()
        : null;
      const logoImageId = uploadedLogo?.id;

      // Filter out empty links
      const filteredOtherLinks = formData.other_links.filter(
        (link) => link.trim() !== ""
      );
      const filteredSocialMediaLinks = formData.social_media.filter(
        (link) => link.trim() !== ""
      );

      const dataToSubmit = {
        primary_content: formData.primary_content,
        country_id: formData.country,
        phone: formData.phone,
        about_brand: formData.about_brand,
        user_name: formData.user_name,
        social_media: filteredSocialMediaLinks,
        website_url: formData.website_url,
        other_links: filteredOtherLinks,
        attachment_id: logoImageId || formData.profileImage?.id,
      };

      const res = await updateUser(dataToSubmit).unwrap();
      toast.success(res?.message || res?.data?.message || "User Updated.");
    } catch (error) {
      toast.error(
        error?.message || error?.data?.message[0] || "Error in Submit"
      );
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        ...initialFormData,
        primary_content: userProfile.primary_content || "",
        phone: userProfile.phone || "",
        about_brand: userProfile.about_brand || "",
        country: userProfile.country?.id || null,
        other_links: userProfile.other_links || ["", "", ""],
        profileImage: userProfile.vendor_logo || sample,
        user_name: userProfile.vendor_name || "",
        social_media: userProfile.social_media || ["", "", ""],
        website_url: userProfile.website_url || "",
      });
      setEditingField(null);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...initialFormData,
        primary_content: userProfile.primary_content || "",
        phone: userProfile.phone || "",
        about_brand: userProfile.about_brand || "",
        country: userProfile.country?.id || null,
        other_links: userProfile.other_links
          ?.concat(["", "", ""])
          ?.slice(0, 3) || ["", "", ""],
        profileImage: userProfile.vendor_logo || sample,
        user_name: userProfile.vendor_name || "",
        social_media: userProfile.social_media
          ?.concat(["", "", ""])
          ?.slice(0, 3) || ["", "", ""],
        website_url: userProfile.website_url || "http://www.example.url.com",
      });
    }
  }, [userProfile, initialFormData]);

  useEffect(() => {
    if (userProfile?.subscriptionStatus?.subscriptionPlan?.name) {
      setSubscriptionStatusName(
        userProfile.subscriptionStatus.subscriptionPlan.name
      );
    }
  }, [userProfile?.subscriptionStatus?.subscriptionPlan?.name]);

  return (
    <>
      <Head>
        <title>Account-Settings</title>
      </Head>
      <div className="w-full min-h-screen flex flex-col justify-between items-center">
        <Header disableAccountSettings={"Yes"} />
        <div className="w-[calc(100%-12px)] sm:max-w-[730px] md:w-[730px] h-auto bg-[#273F7C] text-white rounded-[30px] overflow-hidden my-16 md:my-20 mx-3">
          <div className="w-full h-full flex flex-col items-center justify-center px-2 sm:px-12 pt-2 pb-7 sm:py-7 font-koHo text-base gap-4">
            <div className="w-full h-auto flex justify-center gap-5 md:gap-12 flex-col md:flex-row">
              {/* PROFILE IMAGE AND BRAND DESCRIPTION */}
              <div className="w-full md:max-w-[245px] h-auto flex flex-col items-center justify-start gap-2 text-black bg-[#ADA8A8] p-5 md:p-3 rounded-[28px]">
                <figure
                  className="block"
                  style={{ width: "-webkit-fill-available" }}
                >
                  <Image
                    src={
                      formData.newPickedImage ||
                      formData.profileImage?.url ||
                      sample
                    }
                    alt="profile-img"
                    width={153}
                    height={100}
                    className="h-auto md:mx-auto w-full rounded-2xl"
                  />
                  <figcaption className="md:text-right font-light italic text-sm md:text-base ml-3 md:ml-0 md:mr-7">
                    <input
                      type="file"
                      hidden
                      ref={uploadPicRef}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => uploadPicRef.current.click()}
                      className="mt-1"
                    >
                      Change Logo
                    </button>
                  </figcaption>
                </figure>
                <div className="w-full h-full flex flex-col rounded-md">
                  <div className="w-full text-right font-light italic text-sm md:text-base px-3 flex items-center justify-between">
                    <label htmlFor="brandDesc">Brand Description:</label>
                    <label htmlFor="brandDesc">
                      <Edit
                        className="cursor-pointer"
                        onClick={() =>
                          setEditingField(
                            editingField === "about_brand"
                              ? null
                              : "about_brand"
                          )
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    id="brandDesc"
                    name="about_brand"
                    value={formData.about_brand}
                    onChange={handleFormDataChange}
                    disabled={editingField !== "about_brand"}
                    className={`p-1 rounded-md overflow-scroll resize-none block w-full min-h-52 md:h-full outline-none mt-1 ${
                      editingField === "about_brand"
                        ? "bg-white text-black"
                        : "bg-inherit text-white"
                    }`}
                  ></textarea>
                </div>
              </div>

              <form className="md:w-auto h-auto flex flex-col justify-between gap-2 sm:gap-3 md:gap-5 py-3">
                {/* PRIMARY CONTENT AND PHONE AND WEBSITE_URL AND USER_NAME INPUTS  */}
                {["primary_content", "user_name", "phone", "website_url"].map(
                  (field, idx) => (
                    <div
                      key={idx}
                      className="form-field w-full h-auto flex flex-col items-start gap-1"
                    >
                      <div className="w-full flex items-center justify-between">
                        <label
                          htmlFor={field}
                          className="font-normal text-base"
                        >
                          {field.replace(/_/g, " ").toUpperCase()}:
                        </label>
                        <label
                          htmlFor={field}
                          className="font-normal text-base"
                        >
                          <Edit
                            className="cursor-pointer hover:scale-125 hover:-rotate-45"
                            onClick={() =>
                              setEditingField(
                                editingField === field ? null : field
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="w-full pr-10">
                        <input
                          readOnly={editingField !== field}
                          id={field}
                          type={field === "website_url" ? "url" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleFormDataChange}
                          className={`border-none outline-none text-base font-bold ml-3 w-full px-1 py-2 rounded-sm ${
                            editingField === field
                              ? "bg-white text-black"
                              : "bg-inherit text-white"
                          }`}
                        />
                      </div>
                    </div>
                  )
                )}

                {/* COUNTRY SELECT BOX */}
                <div className="form-field w-full h-auto flex flex-col items-start gap-1">
                  <div className="w-full flex items-center justify-between">
                    <label htmlFor="country" className="font-normal text-base">
                      Country:
                    </label>
                    <label htmlFor="country" className="font-normal text-base">
                      <Edit
                        className="cursor-pointer hover:scale-125 hover:-rotate-45"
                        onClick={() =>
                          setEditingField(
                            editingField === "country" ? null : "country"
                          )
                        }
                      />
                    </label>
                  </div>
                  <div className="w-full pr-10">
                    <select
                      id="country"
                      className={`border-none outline-none text-base font-bold ml-3 w-full px-1 py-2 rounded-sm ${
                        editingField === "country"
                          ? "bg-white text-black"
                          : "bg-inherit text-white"
                      }`}
                      name="country"
                      value={formData?.country || ""}
                      onChange={handleCountryUpdate}
                      disabled={editingField !== "country"}
                    >
                      {activeCountries?.map((country) => (
                        <option
                          key={country.id}
                          value={country.id}
                          className="bg-black text-white"
                        >
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* OTHER LINKS */}
                <div className="form-field w-full h-auto flex flex-col gap-3">
                  <div className="w-full flex items-center justify-between">
                    <label htmlFor="links" className="font-normal text-base">
                      Other Links:
                    </label>
                    <label htmlFor="links" className="font-normal text-base">
                      <Edit
                        className="cursor-pointer hover:scale-125 hover:-rotate-45"
                        onClick={() =>
                          setEditingField(
                            editingField === "other_links"
                              ? null
                              : "other_links"
                          )
                        }
                      />
                    </label>
                  </div>
                  {formData?.other_links?.map((link, idx) => (
                    <div key={idx} className={`w-full h-auto  pr-10`}>
                      <input
                        id="links"
                        type="text"
                        value={link}
                        onChange={(e) => {
                          const updatedLinks = [...formData.other_links];
                          updatedLinks[idx] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            other_links: updatedLinks,
                          }));
                        }}
                        name={`other_links_${idx}`}
                        disabled={editingField !== "other_links"}
                        className={`border-none outline-none text-base font-bold ml-3 w-full px-1 py-2 rounded-sm ${
                          editingField === "other_links"
                            ? "bg-white text-black"
                            : "bg-inherit text-white"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* SOCIAL MEDIA LINKS */}
                <div className="form-field w-full h-auto flex flex-col gap-3">
                  <div className="w-full flex items-center justify-between">
                    <label
                      htmlFor="socialLinks"
                      className="font-normal text-base"
                    >
                      Social Media:
                    </label>
                    <label
                      htmlFor="socialLinks"
                      className="font-normal text-base"
                    >
                      <Edit
                        className="cursor-pointer hover:scale-125 hover:-rotate-45"
                        onClick={() =>
                          setEditingField(
                            editingField === "social_media"
                              ? null
                              : "social_media"
                          )
                        }
                      />
                    </label>
                  </div>
                  {formData.social_media.map((link, idx) => (
                    <div key={idx} className={`w-full h-auto  pr-10`}>
                      <input
                        id="socialLinks"
                        type="text"
                        value={link}
                        onChange={(e) => {
                          const updatedLinks = [...formData.social_media];
                          updatedLinks[idx] = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            social_media: updatedLinks,
                          }));
                        }}
                        name={`social_media_${idx}`}
                        disabled={editingField !== "social_media"}
                        className={`border-none outline-none text-base font-bold ml-3 w-full px-1 py-2 rounded-sm ${
                          editingField === "social_media"
                            ? "bg-white text-black"
                            : "bg-inherit text-white"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* CURRENT PLAN AND BILLING SETTINGS */}
            <div className="w-full flex items-start justify-center">
              <div className="w-full md:w-[500px] flex flex-col items-center justify-start gap-3 border-t-2 border-white py-3 font-KoHo text-base font-normal">
                <h3>Current plan:</h3>
                <div className="flex items-center justify-center gap-7 pl-16">
                  <h2 className="text-[24px] font-bold">
                    {subscriptionStatusName}
                  </h2>
                  <Link
                    href={"/package-plans"}
                    className="text-[12px] italic font-normal"
                  >
                    change
                  </Link>
                </div>
                <div className="mt-2">
                  <Link href={""} className="italic font-normal text-base">
                    Change Billing Information
                  </Link>
                </div>
              </div>
            </div>

            {/* SAVE AND CANCEL BUTTONS */}
            <div className="flex items-start justify-end w-full">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="bg-[#27A213] w-[89px] h-[24px] rounded-[7px] font-kodchasan text-[20px] font-bold"
                  onClick={handleSubmit}
                  disabled={isUpdateLoading}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-[#A21313] w-[89px] h-[26px] rounded-[7px] font-kodchasan text-[20px] font-bold"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WithAuth(AccountSettings, ["VENDOR"]);
