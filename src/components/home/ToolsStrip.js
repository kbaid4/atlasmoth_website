import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ToolsStrip = () => {
  // Tools we are proficient with
  const tools = [
    { name: 'Figma', image: '/ToolsStrip/Figma.png', url: 'https://www.figma.com/' },
    { name: 'Framer', image: '/ToolsStrip/pREE9VLSuqkzsJO1BtrMWy4WVVI.avif', url: 'https://www.framer.com/' },
    { name: 'Windsurf', image: '/ToolsStrip/favicon.svg', url: 'https://windsurf.ai/' },
    { name: 'VS Code', image: '/ToolsStrip/Visual_Studio_Code_1.35_icon.svg.png', url: 'https://code.visualstudio.com/' },
    { name: 'Cursor', image: '/ToolsStrip/cursor-app-icon.webp', url: 'https://cursor.sh/' },
    { name: 'Lovable', image: '/ToolsStrip/apple-touch-icon.png', url: 'https://www.lovable.io/' },
    { name: 'Bolt', image: '/ToolsStrip/0__x9xhkOzkw3ikYci.jpg', url: 'https://www.bolt.com/' },
    { name: 'React', image: '/ToolsStrip/React.svg.png', url: 'https://react.dev/' },
    { name: 'HTML', image: '/ToolsStrip/HTML5_logo_and_wordmark.svg.png', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'CSS', image: '/ToolsStrip/1_50R1_jrwum8K-54tZFeefQ.png', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { name: 'JavaScript', image: '/ToolsStrip/javascript-266x300.png', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'Supabase', image: '/ToolsStrip/supabase-logo-png_seeklogo-435677.png', url: 'https://supabase.com/' },
    { name: 'Slack', image: '/ToolsStrip/Slack_icon_2019.svg.webp', url: 'https://slack.com/' },
    { name: 'Discord', image: '/ToolsStrip/aaz90x6gs.webp', url: 'https://discord.com/' },
    { name: 'Canva', image: '/ToolsStrip/1691829322canva-app-logo-png.png', url: 'https://www.canva.com/' },
    { name: 'Adobe CC', image: '/ToolsStrip/Adobe_Creative_Cloud_rainbow_icon.svg.png', url: 'https://www.adobe.com/creativecloud.html' },
    { name: 'Sketch', image: '/ToolsStrip/sketch3126.jpg', url: 'https://www.sketch.com/' },
    { name: 'Jira', image: '/ToolsStrip/unnamed.png', url: 'https://www.atlassian.com/software/jira' },
    { name: 'Notion', image: '/ToolsStrip/channels4_profile.jpg', url: 'https://www.notion.so/' },
    { name: 'Unity', image: '/ToolsStrip/unnamed (1).png', url: 'https://unity.com/' },
    { name: 'Unreal Engine', image: '/ToolsStrip/unreal.png', url: 'https://www.unrealengine.com/' },
    { name: 'WordPress', image: '/ToolsStrip/wordpress-logo-image-png-701751694773680sodsik7zlf.png', url: 'https://wordpress.org/' },
    { name: 'Wix', image: '/ToolsStrip/images.png', url: 'https://www.wix.com/' },
    { name: 'Replit', image: '/ToolsStrip/New_Replit_Logo.svg.png', url: 'https://replit.com/' },
    { name: 'GitHub', image: '/ToolsStrip/github.jpeg', url: 'https://github.com/' },
    { name: 'TypeScript', image: '/ToolsStrip/Typescript_logo_2020.svg.png', url: 'https://www.typescriptlang.org/' },
  ];

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [marqueeDistance, setMarqueeDistance] = useState(null);

  useEffect(() => {
    function updateDistance() {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        // Only scroll if content is wider than container
        setMarqueeDistance(contentWidth > containerWidth ? contentWidth - containerWidth : 0);
      }
    }
    updateDistance();
    window.addEventListener('resize', updateDistance);
    return () => window.removeEventListener('resize', updateDistance);
  }, []);

  return (
    <section className="bg-surface py-12 overflow-hidden">
      <div className="text-center mb-16" style={{opacity: 1, transform: 'none'}}>
        <div className="inline-block mb-3 bg-green-500/20 text-green-500 px-4 py-1 rounded-full">
          <span className="font-display text-xs">OUR TECH ARSENAL</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">Our Digital Toolbox</h2>
        <p className="text-text-secondary max-w-xl mx-auto">Leveraging cutting-edge technologies to craft exceptional digital experiences and bring your vision to life.</p>
      </div>

      {/* Auto-scrolling marquee effect */}
      <div className="relative overflow-x-hidden">
        <div ref={containerRef} className="w-full overflow-x-hidden">
          <motion.div
            ref={contentRef}
            className="flex space-x-12 whitespace-nowrap"
            animate={marqueeDistance !== null ? { x: [0, -marqueeDistance] } : false}
            transition={marqueeDistance !== null ? {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20, // Slightly slower than client strip for easier reading
                ease: "linear"
              },
            } : {}}
          >
            {tools.map((tool, index) => (
              <div 
                key={`${tool.name}-${index}`} 
                className="flex flex-col items-center justify-center min-w-[100px]"
              >
                <a 
                  href={tool.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center hover:scale-105 transition-all"
                  aria-label={`Learn more about ${tool.name}`}
                >
                  <div className="h-12 w-12 flex items-center justify-center mb-2">
                    <img 
                      src={tool.image} 
                      alt={`${tool.name} logo`} 
                      className="h-full w-full object-contain opacity-75 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <p className="text-text-secondary text-xs font-medium group-hover:text-primary transition-colors">{tool.name}</p>
                </a>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Gradient overlays to fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-surface to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-surface to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default ToolsStrip;
