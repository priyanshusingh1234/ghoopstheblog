import InsightRoll from "@/src/components/About/InsightRoll";


const insights = [
      "📝 50+ Quality Posts & Counting",
  "🚀 Just Getting Started — Join Us Early!",
  "❤️ Your Support Means Everything to Us",
  "🙏 Help Us Grow by Sharing Our Blog",
  "📣 We’re Building a Helpful Space for Everyone",
  "🌱 Be a Part of Our Growing Reader Community",
  "💬 Feedback & Suggestions Always Welcome!",
];
  

export default function AboutLayout({ children }) {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      <InsightRoll insights={insights} />
      {children}
    </main>
  );
}
