import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";

type Class = {
  id: string;
  name: string;
};

type Props = {
  classE: Class;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  const classes = Array.isArray(data.data.classes)
    ? data.data.classes
    : data.data.classes || [];

  const paths = classes.map((classE: Class) => ({
    params: { id: classE.id.toString() },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes/${params?.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  const classE = data.data.class;
  return {
    props: { classE },
    revalidate: 10, // ISR
  };
};

const handleSubmit = async (
  e: { preventDefault: () => void },
  id: string,
  name: string
) => {
  e.preventDefault();
  console.log("Authorization Header:", `Bearer ${process.env.BearerToken}`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name}),
    }
  );
  if (!res.ok) {
    alert("Error updating class");
    console.log("Error: ", res);
    return;
  }
  const content = await res.json();
  console.log("content", content);
  alert("Class Updated!");
};

const ClassDetail: React.FC<Props> = ({ classE }) => {
  if (!classE) return <div>Loading...</div>;
  const [name, setName] = useState(classE.name);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="mb-4">
        <p className="text-lg font-semibold">ID: <span className="font-normal">{classE.id}</span></p>
        <p className="text-lg font-semibold">Name: <span className="font-normal">{classE.name}</span></p>
      </div>
      <form
        className="bg-white p-6 rounded-lg shadow"
        onSubmit={(e) => handleSubmit(e, classE.id, name)}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ClassDetail;
