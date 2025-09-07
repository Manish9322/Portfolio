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
    "Contact",
    "Feedback",
    "Activity",
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

      // Update project order
      updateProjectOrder: builder.mutation({
        query: ({ orderedIds }) => ({
          url: "/projects/order",
          method: "PATCH",
          body: { orderedIds },
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

    // Fetch single blog
    getBlog: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Like/Unlike a blog
    toggleBlogLike: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: { action: 'like', userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Add a comment to a blog
    addBlogComment: builder.mutation({
      query: ({ id, name, email, website, comment }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: { action: 'comment', name, email, website, comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Share a blog (increment share count)
    shareBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: { action: 'share' },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }],
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

    // ======================================== CONTACT MESSAGES ======================================== //

    // Fetch contact messages
    getContactMessages: builder.query({
      query: ({ page = 1, limit = 10, filter = 'all' } = {}) => 
        `/contact?page=${page}&limit=${limit}&filter=${filter}`,
      providesTags: ["Contact"],
    }),

    // Update contact message (mark as read, starred, archived, etc.)
    updateContactMessage: builder.mutation({
      query: ({ id, updates }) => ({
        url: "/contact",
        method: "PUT",
        body: { id, updates },
      }),
      invalidatesTags: ["Contact"],
    }),

    // Delete contact message
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: "/contact",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Contact"],
    }),

    // ======================================== FEEDBACK ======================================== //

    // Fetch all feedbacks
    getFeedbacks: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams();
        if (params.type) queryString.append("type", params.type);
        if (params.visible !== undefined) queryString.append("visible", params.visible);
        if (params.approved !== undefined) queryString.append("approved", params.approved);
        if (params.limit) queryString.append("limit", params.limit);
        
        return `/feedback${queryString.toString() ? `?${queryString.toString()}` : ""}`;
      },
      providesTags: ["Feedback"],
    }),

    // Add new feedback
    addFeedback: builder.mutation({
      query: (feedback) => ({
        url: "/feedback",
        method: "POST",
        body: feedback,
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Update feedback
    updateFeedback: builder.mutation({
      query: (feedback) => ({
        url: "/feedback",
        method: "PUT",
        body: feedback,
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Delete feedback
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/feedback?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Reorder feedbacks
    reorderFeedbacks: builder.mutation({
      query: (feedbackIds) => ({
        url: "/feedback/reorder",
        method: "POST",
        body: { feedbackIds },
      }),
      invalidatesTags: ["Feedback"],
    }),

    // ======================================== ACTIVITY ======================================== //

    // Fetch activities
    getActivities: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams();
        
        if (params.page) queryString.append("page", params.page.toString());
        if (params.limit) queryString.append("limit", params.limit.toString());
        if (params.category) queryString.append("category", params.category);
        if (params.user) queryString.append("user", params.user);
        if (params.search) queryString.append("search", params.search);
        if (params.startDate) queryString.append("startDate", params.startDate);
        if (params.endDate) queryString.append("endDate", params.endDate);
        
        return `/activity${queryString.toString() ? `?${queryString.toString()}` : ""}`;
      },
      providesTags: ["Activity"],
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
  useUpdateProjectOrderMutation,

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
  useGetBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogOrderMutation,
  useToggleBlogLikeMutation,
  useAddBlogCommentMutation,
  useShareBlogMutation,

  useGetGalleryQuery,
  useAddGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useUpdateGalleryOrderMutation,

  useGetContactMessagesQuery,
  useUpdateContactMessageMutation,
  useDeleteContactMessageMutation,

  useGetFeedbacksQuery,
  useAddFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useReorderFeedbacksMutation,

  useGetActivitiesQuery,
} = portfolioApi;
