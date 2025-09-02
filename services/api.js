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
    "Blog",
    "Gallery",
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

    // Fetch single project
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
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

    // ======================================== BLOG ======================================== //

    // Fetch blogs
    getBlogs: builder.query({
      query: () => "/blog",
      providesTags: ["Blog"],
    }),

    // Add a blog
    addBlog: builder.mutation({
      query: (blog) => ({
        url: "/blog",
        method: "POST",
        body: blog,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Update a blog
    updateBlog: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: "/blog",
        method: "PUT",
        body: { _id, ...rest },
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete a blog
    deleteBlog: builder.mutation({
      query: (_id) => ({
        url: `/blog?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Update blog order
    updateBlogOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "/blog",
        method: "PATCH",
        body: { orderedIds },
      }),
      invalidatesTags: ["Blog"],
    }),

    // ======================================== GALLERY ======================================== //

    // Fetch gallery
    getGallery: builder.query({
      query: () => "/gallery",
      providesTags: ["Gallery"],
    }),

    // Add a gallery item
    addGallery: builder.mutation({
      query: (item) => ({
        url: "/gallery",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Gallery"],
    }),

    // Update a gallery item
    updateGallery: builder.mutation({
      query: ({ _id, ...rest }) => ({
        url: "/gallery",
        method: "PUT",
        body: { _id, ...rest },
      }),
      invalidatesTags: ["Gallery"],
    }),

    // Delete a gallery item
    deleteGallery: builder.mutation({
      query: (_id) => ({
        url: `/gallery?id=${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gallery"],
    }),

    // Update gallery order
    updateGalleryOrder: builder.mutation({
      query: ({ orderedIds }) => ({
        url: "/gallery",
        method: "PATCH",
        body: { orderedIds },
      }),
      invalidatesTags: ["Gallery"],
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
  useGetProjectQuery,
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

  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogOrderMutation,

  useGetGalleryQuery,
  useAddGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useUpdateGalleryOrderMutation,
} = portfolioApi;
