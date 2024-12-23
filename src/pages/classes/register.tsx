import { useRouter } from "next/router";
import { useState } from "react";

export default function RegisterClass() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!res.ok) {
      alert("Error registering class");
      console.error("Error: ", res);
      return;
    }
    alert("Class Registered!");
    setName("");
    router.push("/classes");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Register Class</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter class name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
