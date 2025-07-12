import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [
    "Portfolio",
    "Projects",
    "Education",
    "Experience",
    "Messages",
    "Profile",
  ],
  endpoints: (builder) => ({
    // ======================================== PROFILE ======================================== //

    // Fetch profile
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (profile) => ({
        url: "/profile",
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ======================================== SKILLS ======================================== //

    // Fetch skills
    getSkills: builder.query({
      query: () => "/skills",
      providesTags: ["Portfolio"],
    }),

    // Add a skill
    addSkill: builder.mutation({
      query: (skill) => ({
        url: "/skills",
        method: "POST",
        body: skill,
      }),
      invalidatesTags: ["Portfolio"],
    }),

    // Update a skill
    updateSkill: builder.mutation({
      query: ({ _id, ...skill }) => ({
        url: `/skills`,
        method: "PUT",
        body: { _id, ...skill },
      }),
      invalidatesTags: ["Portfolio"],
    }),

    // Delete a skill
    deleteSkill: builder.mutation({
      query: (_id) => ({
        url: `/skills?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Portfolio"],
    }),

    // Update skill order
    updateSkillOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "/skills",
        method: "PATCH",
        body: { orderedIds },
      }),
      invalidatesTags: ["Portfolio"],
    }),

    // ======================================== PROJECTS ======================================== //

    // Fetch projects
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),

    // Add a project
    addProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Update a project
    updateProject: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: "/projects",
        method: "PUT",
        body: { _id, ...rest },
      }),
      invalidatesTags: ["Projects"],
    }),

    // Delete a project
    deleteProject: builder.mutation({
      query: (_id) => ({
        url: `/projects?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    // ======================================== EDUCATION ======================================== //

    // Fetch education
    getEducation: builder.query({
      query: () => "/education",
      providesTags: ["Education"],
    }),

    // Add education
    addEducation: builder.mutation({
      query: (education) => ({
        url: "/education",
        method: "POST",
        body: education,
      }),
      invalidatesTags: ["Education"],
    }),

    // Update education
    updateEducation: builder.mutation({
      query: ({ _id, ...education }) => ({
        url: "/education",
        method: "PUT",
        body: { _id, ...education },
      }),
      invalidatesTags: ["Education"],
    }),

    // Delete education
    deleteEducation: builder.mutation({
      query: (_id) => ({
        url: `/education?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Education"],
    }),

    // Update education order
    updateEducationOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "education/order",
        method: "PUT",
        body: { orderedIds },
      }),
      invalidatesTags: ["Education"],
    }),

    // ======================================== EXPERIENCE ======================================== //

    // Fetch experiences
    getExperiences: builder.query({
      query: () => "/experience",
      providesTags: ["Experience"],
    }),

    // Add an experience
    addExperience: builder.mutation({
      query: (experience) => ({
        url: "/experience",
        method: "POST",
        body: experience,
      }),
      invalidatesTags: ["Experience"],
    }),

    // Update an experience
    updateExperience: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: "/experience",
        method: "PUT",
        body: { _id, ...rest },
      }),
      invalidatesTags: ["Experience"],
    }),

    // Delete an experience
    deleteExperience: builder.mutation({
      query: (_id) => ({
        url: `/experience?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Experience"],
    }),

    // Update experience order
    updateExperienceOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "/experience",
        method: "PATCH",
        body: { orderedIds },
      }),
      invalidatesTags: ["Experience"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,

  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useUpdateSkillOrderMutation,

  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,

  useGetEducationQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationOrderMutation,

  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceOrderMutation,
} = portfolioApi;
