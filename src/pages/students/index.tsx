import { GetServerSideProps } from "next";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

type Student = {
  id: string;
  name: string;
  classId: string;
};

type Props = {
  students: Student[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error(`Failed to fetch students: ${res.statusText}`);
    return {
      props: { students: [] },
    };
  }

  const data = await res.json();
  const students = Array.isArray(data.data.students)
    ? data.data.students
    : data.data.students || [];

  return {
    props: { students },
  };
};

const StudentList: React.FC<Props> = ({ students }) => {
  const [searchType, setSearchType] = useState("search-name");
  const [displayStudent, setDisplayStudent] = useState(students);

  async function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value.trim();
    if (searchValue === "") {
      setDisplayStudent(students);
      return;
    }

    const url =
      searchType === "search-name"
        ? `/students/search/by-name?name=${searchValue}`
        : `/students/search/by-class?className=${searchValue}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}${url}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setDisplayStudent(data.data.student || []);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/students/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (res.ok) {
      // Filter out the deleted student from the displayStudent state
      setDisplayStudent((prev) => prev.filter((student) => student.id !== id));
    } else {
      console.error(`Failed to delete student: ${res.statusText}`);
      alert("Failed to delete the student. Please try again.");
    }
  }
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Student List (SSR)</h1>

      <div className="flex flex-col md:flex-row items-center mb-4">
        <input
          type="search"
          name="search"
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2 mb-4 md:mb-0 md:mr-4"
          placeholder="Enter search value"
          onChange={handleSearch}
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
        >
          <option value="search-name">Search by name</option>
          <option value="search-class">Search by class name</option>
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          href="/students/register"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Student
        </Link>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Id</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Detail</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {displayStudent.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{student.id}</td>
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  href={`/students/${student.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Detail
                </Link>
              </td>
              <td
                className="border border-gray-300 px-4 py-2 text-red-500 cursor-pointer hover:underline"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
