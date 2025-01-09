import { gql, useQuery } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import createApolloClient from "../../../lib/apollo-client";

type Student = {
  id: string;
  name: string;
  classId: string;
};

type Props = {
  student: Student;
};
      //{Graphql}
const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      id
      name
      classId
    }
  }
`;

const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: String!) {
    getStudentById(id:$id) {
      id
      name
      classId
    }
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_ALL_STUDENTS,
  });
          //{Rest}
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // const data = await res.json();
  // const students = Array.isArray(data.data.students)
  //   ? data.data.students
  //   : data.data.students || [];
  const students = data.getAllStudents
  const paths = students.map((student: Student) => ({
    params: { id: student.id.toString() },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_STUDENT_BY_ID,
    variables: {id: params!.id}
  });
  //      {Rest}
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students/${params?.id}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // const data = await res.json();
  // const student = data.data.student;
  // console.log("student", data.data.student);
  const student = data.getStudentById
  return {
    props: { student },
    revalidate: 10, // ISR
  };
};

const handleSubmit = async (
  e: { preventDefault: () => void },
  id: string,
  name: string,
  classId: string
) => {
  e.preventDefault();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, classId }),
    }
  );
  if (!res.ok) {
    alert("Error updating student");
    console.log("Error: ", res);
    return;
  }
  const content = await res.json();
  console.log("content", content);
  alert("Student Updated!");
};

const StudentDetail: React.FC<Props> = ({ student }) => {
  if (!student) return <div>Loading...</div>;
  const [name, setName] = useState(student.name);
  const [classId, setClassId] = useState(student.classId);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="mb-4">
        <p className="text-lg font-semibold">ID: <span className="font-normal">{student.id}</span></p>
        <p className="text-lg font-semibold">Name: <span className="font-normal">{student.name}</span></p>
        <p className="text-lg font-semibold">Class ID: <span className="font-normal">{student.classId}</span></p>
      </div>
      <form
        className="bg-white p-6 rounded-lg shadow"
        onSubmit={(e) => handleSubmit(e, student.id, name, classId)}
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
        <div className="mb-4">
          <label htmlFor="classId" className="block text-gray-700 font-semibold mb-2">
            Class ID
          </label>
          <input
            type="text"
            id="classId"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Class ID"
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

export default StudentDetail;
