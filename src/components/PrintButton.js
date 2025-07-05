'use client';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="mt-4 bg-white dark:bg-dark text-black dark:text-white px-4 py-2 rounded shadow hover:bg-gray-200 dark:hover:bg-[#333] transition-all text-sm print:hidden"
    >
      🖨️ Print / Save as PDF
    </button>
  );
}
