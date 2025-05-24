import InsightRoll from "@/src/components/About/InsightRoll";


const insights = [
     "150+ Blog Posts Published",
  "3+ Years of Blogging Experience",
  "98% Reader Satisfaction",
  "25K+ Monthly Readers",
  "Featured on Medium & Dev.to",
  "Guest Contributor to Popular Tech Blogs 📝",
  "Recipient of the Best Blogger Award 🏆",
];
  

export default function AboutLayout({ children }) {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
