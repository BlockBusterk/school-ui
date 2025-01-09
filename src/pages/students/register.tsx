import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import createApolloClient from "../../../lib/apollo-client";

export default function RegisterStudent() {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const router = useRouter();
  interface CreateStudentInput {
    name: string;
    classId: string;
  }
  const CREATE_STUDENT = gql`
      mutation CreateStudent($createStudentInput: CreateStudentInput!){
            createStudent(createStudentInput: $createStudentInput){
              id,
              name,
              classId
            }
      }
  `
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const createStudentInput = {
      name,
      classId
    }
    try {
      const client = createApolloClient(); 
      const { data } = await client.mutate({
        mutation: CREATE_STUDENT,
        variables: { createStudentInput }, 
      });
  
      console.log("Student created:", data.createStudent);
    } catch (error) {
      console.error("Error creating student:", error);
      return
    }
          //{Rest}
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ name, classId }),
    //   }
    // );
    // if (!res.ok) {
    //   alert("Error registering student");
    //   console.error("Error: ", res);
    //   return;
    // }
    alert("Student Registered!");
    setName("");
    setClassId("");
    router.push("/students");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Register Student</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
            Class ID
          </label>
          <input
            type="text"
            id="classId"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Enter class ID"
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
