"use client";

import React from "react";
import {
  useGetSkillsQuery,
  useGetProjectsQuery,
  useGetBlogsQuery,
  useGetGalleryQuery,
} from "@/services/api";
import {
  FaRocket,
  FaBullseye,
  FaDumbbell,
  FaBolt,
  FaPalette,
  FaStar,
  FaFire,
  FaGem,
  FaTrophy,
  FaHeart,
  FaPen,
  FaBrain,
  FaBook,
  FaLightbulb,
  FaCamera,
  FaImage,
  FaPaintBrush,
  FaRainbow,
  FaEye,
  FaTheaterMasks,
  FaSearch,
  FaGlobe,
  FaCoffee,
} from "react-icons/fa";
import {
  MdRocketLaunch,
  MdAutoAwesome,
  MdCelebration,
  MdVisibility,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

interface MarqueeItem {
  id: string;
  title: string;
  icon: React.JSX.Element;
  type: "skill" | "project" | "blog" | "gallery";
  createdAt?: string;
}

interface SkillGroup {
  _id: string;
  category: string;
  items: string[];
  order: number;
  createdAt?: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt?: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
  imageUrl?: string;
}

interface Gallery {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  tags: string[];
}

export function MarqueeStrip() {
  const { data: skillsData = [], isLoading: isLoadingSkills } =
    useGetSkillsQuery(undefined);
  const { data: projectsData = [], isLoading: isLoadingProjects } =
    useGetProjectsQuery(undefined);
  const { data: blogsData = [], isLoading: isLoadingBlogs } =
    useGetBlogsQuery(undefined);
  const { data: galleryData = [], isLoading: isLoadingGallery } =
    useGetGalleryQuery(undefined);

  const isLoading =
    isLoadingSkills || isLoadingProjects || isLoadingBlogs || isLoadingGallery;

  // Fun text generators for each type
  const getSkillText = (skill: string, category: string) => {
    const skillMessages = [
      {
        icon: <FaRocket className="inline w-4 h-4 mr-2" />,
        text: `Just mastered ${skill} in ${category}! Another tool in the arsenal!`,
      },
      {
        icon: <FaBullseye className="inline w-4 h-4 mr-2" />,
        text: `Leveled up my ${skill} skills! ${category} just got more exciting!`,
      },
      {
        icon: <FaDumbbell className="inline w-4 h-4 mr-2" />,
        text: `New superpower unlocked: ${skill} in ${category}!`,
      },
      {
        icon: <FaBolt className="inline w-4 h-4 mr-2" />,
        text: `Fresh ${skill} skills added to my ${category} toolkit!`,
      },
      {
        icon: <FaPalette className="inline w-4 h-4 mr-2" />,
        text: `Discovered the magic of ${skill} in ${category}!`,
      },
      {
        icon: <FaStar className="inline w-4 h-4 mr-2" />,
        text: `${skill} mastery achieved! ${category} is now my playground!`,
      },
    ];
    const selected =
      skillMessages[Math.floor(Math.random() * skillMessages.length)];
    return { icon: selected.icon, text: selected.text };
  };

  const getProjectText = (title: string) => {
    const projectMessages = [
      {
        icon: <MdCelebration className="inline w-4 h-4 mr-2" />,
        text: `Hot off the press: "${title}" - my latest creation is live!`,
      },
      {
        icon: <MdRocketLaunch className="inline w-4 h-4 mr-2" />,
        text: `Brand new project alert! Check out "${title}" - I'm quite proud of this one!`,
      },
      {
        icon: <FaGem className="inline w-4 h-4 mr-2" />,
        text: `Crafted with love: "${title}" is now ready for the world!`,
      },
      {
        icon: <FaFire className="inline w-4 h-4 mr-2" />,
        text: `Fresh from the code oven: "${title}" - still warm and ready to impress!`,
      },
      {
        icon: <IoSparkles className="inline w-4 h-4 mr-2" />,
        text: `Introducing "${title}" - where creativity meets functionality!`,
      },
      {
        icon: <FaTrophy className="inline w-4 h-4 mr-2" />,
        text: `Project milestone achieved! "${title}" is officially launched!`,
      },
      {
        icon: <FaStar className="inline w-4 h-4 mr-2" />,
        text: `Latest masterpiece: "${title}" - built with passion and pixels!`,
      },
    ];
    const selected =
      projectMessages[Math.floor(Math.random() * projectMessages.length)];
    return { icon: selected.icon, text: selected.text };
  };

  const getBlogText = (title: string) => {
    const blogMessages = [
      {
        icon: <FaPen className="inline w-4 h-4 mr-2" />,
        text: `New thoughts shared: "${title}" - grab a coffee and dive in!`,
      },
      {
        icon: <FaBrain className="inline w-4 h-4 mr-2" />,
        text: `Fresh insights brewing: "${title}" - my latest brain dump!`,
      },
      {
        icon: <FaBook className="inline w-4 h-4 mr-2" />,
        text: `Just published: "${title}" - hope you find it as exciting as I do!`,
      },
      {
        icon: <FaLightbulb className="inline w-4 h-4 mr-2" />,
        text: `Been pondering about "${title}" - sharing my thoughts with you!`,
      },
      {
        icon: <FaPen className="inline w-4 h-4 mr-2" />,
        text: `New story time: "${title}" - come for the code, stay for the journey!`,
      },
      {
        icon: <FaBullseye className="inline w-4 h-4 mr-2" />,
        text: `Latest wisdom drop: "${title}" - from my brain to your screen!`,
      },
      {
        icon: <FaBook className="inline w-4 h-4 mr-2" />,
        text: `Chapter added to my digital diary: "${title}" - enjoy the read!`,
      },
    ];
    const selected =
      blogMessages[Math.floor(Math.random() * blogMessages.length)];
    return { icon: selected.icon, text: selected.text };
  };

  const getGalleryText = (title: string) => {
    const galleryMessages = [
      {
        icon: <FaCamera className="inline w-4 h-4 mr-2" />,
        text: `Visual feast incoming: "${title}" - feast your eyes on this beauty!`,
      },
      {
        icon: <FaPaintBrush className="inline w-4 h-4 mr-2" />,
        text: `New artwork alert! "${title}" just dropped in the gallery!`,
      },
      {
        icon: <FaImage className="inline w-4 h-4 mr-2" />,
        text: `Picture perfect moment: "${title}" - captured and curated just for you!`,
      },
      {
        icon: <FaRainbow className="inline w-4 h-4 mr-2" />,
        text: `Color me excited! "${title}" is now brightening up the gallery!`,
      },
      {
        icon: <FaCamera className="inline w-4 h-4 mr-2" />,
        text: `Snapshot of creativity: "${title}" - where art meets inspiration!`,
      },
      {
        icon: <FaTheaterMasks className="inline w-4 h-4 mr-2" />,
        text: `Gallery update: "${title}" - because words can't capture everything!`,
      },
      {
        icon: <IoSparkles className="inline w-4 h-4 mr-2" />,
        text: `Visual storytelling: "${title}" - let the pixels do the talking!`,
      },
    ];
    const selected =
      galleryMessages[Math.floor(Math.random() * galleryMessages.length)];
    return { icon: selected.icon, text: selected.text };
  };

  // Transform and combine all data
  const getAllItems = (): MarqueeItem[] => {
    const items: MarqueeItem[] = [];

    // Add skills (get recent skills from each category)
    skillsData.forEach((skillGroup: SkillGroup) => {
      skillGroup.items.slice(0, 2).forEach((skill, index) => {
        const skillData = getSkillText(skill, skillGroup.category);
        items.push({
          id: `skill-${skillGroup._id}-${index}`,
          title: skillData.text,
          icon: skillData.icon,
          type: "skill",
          createdAt: skillGroup.createdAt || new Date().toISOString(),
        });
      });
    });

    // Add projects
    projectsData.forEach((project: Project) => {
      const projectData = getProjectText(project.title);
      items.push({
        id: project._id || `project-${Math.random()}`,
        title: projectData.text,
        icon: projectData.icon,
        type: "project",
        createdAt: project.createdAt || new Date().toISOString(),
      });
    });

    // Add blogs
    blogsData.forEach((blog: Blog) => {
      const blogData = getBlogText(blog.title);
      items.push({
        id: blog._id,
        title: blogData.text,
        icon: blogData.icon,
        type: "blog",
        createdAt: blog.createdAt,
      });
    });

    // Add gallery items
    galleryData.forEach((gallery: Gallery) => {
      const galleryItemData = getGalleryText(gallery.title);
      items.push({
        id: gallery._id,
        title: galleryItemData.text,
        icon: galleryItemData.icon,
        type: "gallery",
        createdAt: gallery.createdAt,
      });
    });

    // Sort by creation date (most recent first) and take top 15
    return items
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 15);
  };

  const recentItems = getAllItems();

  // Create duplicate items for seamless scrolling
  const duplicatedItems = [...recentItems, ...recentItems];

  if (isLoading) {
    const loadingMessages = [
      {
        icon: <FaSearch className="inline w-4 h-4 mr-2" />,
        text: "Hunting down the latest updates...",
      },
      {
        icon: <FaBolt className="inline w-4 h-4 mr-2" />,
        text: "Loading fresh content from the creative kitchen...",
      },
      {
        icon: <FaBullseye className="inline w-4 h-4 mr-2" />,
        text: "Gathering the newest additions to my universe...",
      },
      {
        icon: <FaRocket className="inline w-4 h-4 mr-2" />,
        text: "Fetching the latest and greatest...",
      },
      {
        icon: <IoSparkles className="inline w-4 h-4 mr-2" />,
        text: "Brewing some fresh updates for you...",
      },
    ];
    const randomLoadingMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    return (
      <div className="w-full bg-black dark:bg-white py-3 overflow-hidden">
        <div className="flex animate-pulse">
          <div className="whitespace-nowrap text-white dark:text-black text-sm flex items-center">
            {randomLoadingMessage.icon}
            {randomLoadingMessage.text}
          </div>
        </div>
      </div>
    );
  }

  if (recentItems.length === 0) {
    return (
      <div className="w-full bg-black dark:bg-white py-3 overflow-hidden">
        <div className="flex">
          <div className="whitespace-nowrap text-white dark:text-black text-sm flex items-center">
            <FaTheaterMasks className="inline w-4 h-4 mr-2" />
            The stage is set, but the show hasn't started yet! Stay tuned for
            amazing updates...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black dark:bg-white py-3 overflow-hidden">
      {/* Scrolling content */}
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <span
            key={`${item.id}-${index}`}
            className="text-white dark:text-black text-sm font-medium mx-8 flex-shrink-0 flex items-center"
          >
            {item.icon}
            {item.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MarqueeStrip;
