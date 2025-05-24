"use client";
import React, { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  return (
    <form
      action="https://formspree.io/f/mdkgjapr"// Replace with your own endpoint
      method="POST"
      className="mt-12 text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in"
      onSubmit={() => setStatus("Sending...")}
    >
      Hello! My name is{" "}
      <input
        type="text"
        name="name"
        placeholder="your name"
        required
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      and I want to discuss a potential problem. You can email me at
      <input
        type="email"
        name="email"
        placeholder="your@email"
        required
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      or reach out to me on
      <input
        type="tel"
        name="phone"
        placeholder="your phone"
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      Here are some details about my doubts: <br />
      <textarea
        name="message"
        placeholder="My doubt is..."
        rows={3}
        className="w-full outline-none border-0 p-0 mx-0 focus:ring-0 placeholder:text-lg border-b border-gray focus:border-gray bg-transparent"
      />
      <input
        type="submit"
        value="Send Request"
        className="mt-8 font-medium inline-block capitalize text-lg sm:text-xl py-2 sm:py-3 px-6 sm:px-8 border-2 border-solid border-dark dark:border-light rounded cursor-pointer"
      />
      {status && <p className="mt-4 text-blue-600">{status}</p>}
    </form>
  );
}
