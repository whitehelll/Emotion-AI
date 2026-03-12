import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon
} from "lucide-react";

import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {

  const { authUser } = useAuthUser();

  const queryClient = useQueryClient();

  const navigate = useNavigate();


  const [formState, setFormState] = useState({

    fullName: authUser?.fullName || "",

    bio: authUser?.bio || "",

    nativeLanguage: authUser?.nativeLanguage || "",

    learningLanguage: authUser?.learningLanguage || "",

    location: authUser?.location || "",

    profileImg: authUser?.profileImg || "",

  });



  // Mutation
  const { mutate: OnboardingMutation, isPending } = useMutation({

    mutationFn: completeOnboarding,


    onSuccess: () => {

      toast.success("Profile onboard successfully");


      // Refresh auth user
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      });


      // Redirect to Home
      navigate("/");

    },


    onError: (error) => {

      toast.error(
        error.response?.data?.message || "Onboarding failed"
      );

    }

  });



  // Submit Form
  const handleSubmit = (e) => {

    e.preventDefault();

    OnboardingMutation(formState);

  };



  // Random Avatar
  const handleRandomAvatar = () => {

    const idx =
      Math.floor(Math.random() * 100 + 1);


    const randomAvatar =
      `https://avatar.iran.liara.run/public/${idx}.png`;


    setFormState({
      ...formState,
      profileImg: randomAvatar
    });


    toast.success("Random image generated");

  };



  return (
    <div
      className="min-h-screen flex items-center justify-center
bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4"
    >
      <div className="w-full max-w-4xl">
        <div
          className="bg-white/5 backdrop-blur-lg
border border-gray-700
rounded-2xl shadow-2xl p-8 text-white"
        >
          {/* Title */}

          <h1 className="text-3xl font-bold text-center mb-2">
            Complete Your Profile
          </h1>

          <p className="text-center text-gray-400 mb-8">
            Set up your Emotion AI profile
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}

            <div className="flex flex-col items-center gap-4">
              <div
                className="w-36 h-36 rounded-full
bg-black/40 border border-gray-600
overflow-hidden shadow-lg"
              >
                {formState.profileImg ? (
                  <img
                    src={formState.profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="px-5 py-2 rounded-lg
bg-gradient-to-r from-blue-500 to-purple-600
hover:from-blue-600 hover:to-purple-700
transition shadow-md flex items-center gap-2"
              >
                <ShuffleIcon size={18} />
                Random Avatar
              </button>
            </div>

            {/* Name + Location */}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-300 text-sm">Full Name</label>

                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full mt-2 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg outline-none
focus:border-blue-500
focus:ring-1 focus:ring-blue-500
transition"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">Location</label>

                <div className="relative">
                  <MapPinIcon
                    className="absolute left-3 top-1/2
-transform -translate-y-1/2 size-5 opacity-70"
                  />

                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        location: e.target.value,
                      })
                    }
                    placeholder="City, Country"
                    className="w-full mt-2 pl-10 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg outline-none
focus:border-blue-500
focus:ring-1 focus:ring-blue-500
transition"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}

            <div>
              <label className="text-gray-300 text-sm">Bio</label>

              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    bio: e.target.value,
                  })
                }
                placeholder="Tell something about yourself..."
                className="w-full mt-2 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg h-28 outline-none
focus:border-blue-500
focus:ring-1 focus:ring-blue-500
transition"
              />
            </div>

            {/* Languages */}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-300 text-sm">Native Language</label>

                <select
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="w-full mt-2 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg outline-none
focus:border-blue-500"
                >
                  <option value="">Select Language</option>

                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm">
                  Learning Language
                </label>

                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="w-full mt-2 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg outline-none
focus:border-blue-500"
                >
                  <option value="">Select Language</option>

                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 text-lg font-semibold
rounded-lg

bg-gradient-to-r
from-blue-500 to-purple-600

hover:from-blue-600
hover:to-purple-700

transition
shadow-lg
active:scale-95
disabled:opacity-50"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon size={20} />
                  <span className="ml-2">Complete Profile</span>
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin" size={20} />
                  <span className="ml-2">Saving...</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

};

export default Onboarding;