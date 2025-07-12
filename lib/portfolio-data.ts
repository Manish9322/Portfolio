// This file would typically interact with a database
// For now, it's just returning mock data

export type Project = {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  github: string
  featured: boolean
}

export type Skill = {
  id: number
  category: string
  items: string[]
}

export type Experience = {
  id: number
  company: string
  position: string
  period: string
  description: string
  location?: string
  logo?: string
  achievements?: string[]
  technologies?: string[]
  responsibilities?: string[]
  projects?: { name: string; description: string }[]
  website?: string
  startDate?: string
  endDate?: string
  teamSize?: string
  industry?: string
}

export type Education = {
  id: number
  institution: string
  degree: string
  field?: string
  period: string
  location?: string
  description: string
  gpa?: string
  achievements?: string[]
  logo?: string
  website?: string
  startDate?: string
  endDate?: string
  icon?: "graduation" | "certificate" | "course"
  certificateUrl?: string
  type: "degree" | "certification" | "course"
}

export type PortfolioData = {
  name: string
  title: string
  location: string
  email: string
  about: string
  featuredProjects: Project[]
  skills: Skill[]
  experience: Experience[]
  education: Education[]
}

export const getPortfolioData = (): PortfolioData => {
  // In a real app, this would fetch from a database
  return {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    email: "alex@example.com",
    about: "I build exceptional and accessible digital experiences for the web.",
    featuredProjects: [
      {
        id: 1,
        title: "E-commerce Platform",
        description:
          "A full-featured e-commerce platform with payment processing, inventory management, and analytics dashboard.",
        image: "/placeholder.svg?height=600&width=800",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
        link: "https://example.com",
        github: "https://github.com/example/project",
        featured: true,
      },
      {
        id: 2,
        title: "AI Content Generator",
        description:
          "An AI-powered application that generates marketing content based on user prompts and brand guidelines.",
        image: "/placeholder.svg?height=600&width=800",
        tags: ["React", "Node.js", "OpenAI", "MongoDB"],
        link: "https://example.com",
        github: "https://github.com/example/project",
        featured: true,
      },
      {
        id: 3,
        title: "Health & Fitness Tracker",
        description:
          "A comprehensive health tracking application with workout plans, nutrition logging, and progress visualization.",
        image: "/placeholder.svg?height=600&width=800",
        tags: ["React Native", "Firebase", "Chart.js", "Redux"],
        link: "https://example.com",
        github: "https://github.com/example/project",
        featured: false,
      },
    ],
    skills: [
      {
        id: 1,
        category: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
      },
      {
        id: 2,
        category: "Backend",
        items: ["Node.js", "Express", "Python", "Django", "PostgreSQL"],
      },
      {
        id: 3,
        category: "DevOps",
        items: ["Docker", "AWS", "CI/CD", "Kubernetes", "Terraform"],
      },
      {
        id: 4,
        category: "Design",
        items: ["Figma", "Adobe XD", "UI/UX", "Responsive Design"],
      },
    ],
    experience: [
      {
        id: 1,
        company: "Tech Innovations Inc.",
        position: "Senior Developer",
        period: "2020 - Present",
        description:
          "Led development of multiple web applications, mentored junior developers, and implemented CI/CD pipelines.",
      },
      {
        id: 2,
        company: "Digital Solutions LLC",
        position: "Full Stack Developer",
        period: "2018 - 2020",
        description:
          "Developed and maintained client websites, created custom CMS solutions, and optimized application performance.",
      },
      {
        id: 3,
        company: "Web Creators Studio",
        position: "Frontend Developer",
        period: "2016 - 2018",
        description:
          "Built responsive interfaces, collaborated with designers, and implemented accessibility standards.",
      },
    ],
    education: [
      {
        id: 1,
        institution: "Stanford University",
        degree: "Master of Science",
        field: "Computer Science",
        period: "2014 - 2016",
        location: "Stanford, CA",
        description:
          "Specialized in Artificial Intelligence and Machine Learning with a focus on natural language processing.",
        gpa: "3.9/4.0",
        achievements: [
          "Graduated with distinction",
          "Published research paper on NLP techniques",
          "Teaching Assistant for Advanced Algorithms course",
        ],
        logo: "/placeholder.svg?height=80&width=80",
        website: "https://stanford.edu",
        startDate: "2014-09",
        endDate: "2016-06",
        icon: "graduation",
        type: "degree",
      },
      {
        id: 2,
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        period: "2010 - 2014",
        location: "Berkeley, CA",
        description:
          "Comprehensive computer science education with emphasis on software engineering and data structures.",
        gpa: "3.8/4.0",
        achievements: [
          "Dean's List all semesters",
          "Senior project featured at campus tech showcase",
          "Undergraduate Research Assistant",
        ],
        logo: "/placeholder.svg?height=80&width=80",
        website: "https://berkeley.edu",
        startDate: "2010-09",
        endDate: "2014-05",
        icon: "graduation",
        type: "degree",
      },
      {
        id: 3,
        institution: "AWS",
        degree: "AWS Certified Solutions Architect",
        period: "2019",
        description: "Professional certification validating expertise in designing distributed systems on AWS.",
        achievements: ["Passed with score of 980/1000", "Completed advanced networking specialization"],
        logo: "/placeholder.svg?height=80&width=80",
        website: "https://aws.amazon.com/certification/",
        startDate: "2019-03",
        endDate: "2019-04",
        icon: "certificate",
        certificateUrl: "https://example.com/certificate",
        type: "certification",
      },
      {
        id: 4,
        institution: "Coursera",
        degree: "Deep Learning Specialization",
        field: "Machine Learning",
        period: "2018",
        description: "Five-course specialization by Andrew Ng covering deep learning fundamentals and applications.",
        logo: "/placeholder.svg?height=80&width=80",
        website: "https://coursera.org",
        startDate: "2018-01",
        endDate: "2018-05",
        icon: "course",
        certificateUrl: "https://example.com/certificate",
        type: "course",
      },
    ],
  }
}

export const updatePortfolioData = (data: Partial<PortfolioData>): boolean => {
  // In a real app, this would update the database
  console.log("Updating portfolio data:", data)
  return true
}

export const addProject = (project: Omit<Project, "id">): Project => {
  // In a real app, this would add to the database and return with a new ID
  const newProject = {
    ...project,
    id: Date.now(),
  }
  console.log("Adding project:", newProject)
  return newProject
}

export const updateProject = (project: Project): boolean => {
  // In a real app, this would update the project in the database
  console.log("Updating project:", project)
  return true
}

export const deleteProject = (id: number): boolean => {
  // In a real app, this would delete from the database
  console.log("Deleting project:", id)
  return true
}

// Similar functions for education
export const addEducation = (education: Omit<Education, "id">): Education => {
  const newEducation = {
    ...education,
    id: Date.now(),
  }
  console.log("Adding education:", newEducation)
  return newEducation
}

export const updateEducation = (education: Education): boolean => {
  console.log("Updating education:", education)
  return true
}

export const deleteEducation = (id: number): boolean => {
  console.log("Deleting education:", id)
  return true
}

// Similar functions would exist for skills and experience
