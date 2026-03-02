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

    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">

      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">

        <div className="card-body p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>


          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Avatar Section */}

            <div className="flex flex-col items-center justify-center space-y-4">

              <div className="size-32 rounded-full bg-base-300 overflow-hidden">

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
                className="btn btn-accent"
              >

                <ShuffleIcon className="size-4 mr-2" />

                Generate Random Avatar

              </button>

            </div>



            {/* Full Name */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Full Name
                </span>
              </label>


              <input
                type="text"

                value={formState.fullName}

                onChange={(e) =>
                  setFormState({
                    ...formState,
                    fullName: e.target.value
                  })
                }

                className="input input-bordered w-full"

                placeholder="Your Full Name"
              />

            </div>



            {/* Bio */}

            <div className="form-control">

              <label className="label">

                <span className="label-text">
                  Bio
                </span>

              </label>


              <textarea
                value={formState.bio}

                onChange={(e) =>
                  setFormState({
                    ...formState,
                    bio: e.target.value
                  })
                }

                className="textarea textarea-bordered h-24"

                placeholder="Tell about yourself"
              />

            </div>



            {/* Languages */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* Native Language */}

              <div className="form-control">

                <label className="label">

                  <span className="label-text">
                    Native Language
                  </span>

                </label>


                <select
                  value={formState.nativeLanguage}

                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value
                    })
                  }

                  className="select select-bordered w-full"
                >

                  <option value="">
                    Select Language
                  </option>


                  {LANGUAGES.map((lang) => (

                    <option
                      key={lang}
                      value={lang.toLowerCase()}
                    >

                      {lang}

                    </option>

                  ))}

                </select>

              </div>



              {/* Learning Language */}

              <div className="form-control">

                <label className="label">

                  <span className="label-text">
                    Learning Language
                  </span>

                </label>


                <select
                  value={formState.learningLanguage}

                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value
                    })
                  }

                  className="select select-bordered w-full"
                >

                  <option value="">
                    Select Language
                  </option>


                  {LANGUAGES.map((lang) => (

                    <option
                      key={lang}
                      value={lang.toLowerCase()}
                    >

                      {lang}

                    </option>

                  ))}

                </select>

              </div>

            </div>



            {/* Location */}

            <div className="form-control">

              <label className="label">

                <span className="label-text">
                  Location
                </span>

              </label>


              <div className="relative">

                <MapPinIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 size-5 opacity-70" />

                <input
                  type="text"

                  value={formState.location}

                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      location: e.target.value
                    })
                  }

                  className="input input-bordered w-full pl-10"

                  placeholder="City, Country"
                />

              </div>

            </div>



            {/* Submit */}

            <button
              className="btn btn-primary w-full"

              disabled={isPending}

              type="submit"
            >

              {!isPending ? (

                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>

              ) : (

                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
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