import { GetServerSideProps } from "next";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import createApolloClient from "../../../lib/apollo-client";
import { gql } from "@apollo/client";

type Class = {
  id: string;
  name: string;
};

type Props = {
  classes: Class[];
};
          //{Graphql}
const GET_ALL_CLASSES = gql`
  query GetAllClasses {
    getAllClasses {
      id
      name
    }
  }
`;
export async function getServerSideProps() {
  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_ALL_CLASSES,
  });

  return {
    props: {
      classes: data.getAllClasses,
    },
  };
}
                  //{Rest}
// export const getServerSideProps: GetServerSideProps = async () => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!res.ok) {
//     console.error(`Failed to fetch students: ${res.statusText}`);
//     return {
//       props: { students: [] },
//     };
//   }

//   const data = await res.json();
//   const classes = Array.isArray(data.data.classes)
//     ? data.data.classes
//     : data.data.classes || [];

//   return {
//     props: { classes },
//   };
// };

const ClassList: React.FC<Props> = ({ classes}) => {
const [displayClass, setDisplayClass] = useState(classes)
  async function handleDelete(id: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_PUBLIC_API_BASE_URL}/classes/${id}`,
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
      setDisplayClass((prev: any[]) => prev.filter((classE) => classE.id !== id));
    } else {
      console.error(`Failed to delete student: ${res.statusText}`);
      alert("Failed to delete class. Please try again.");
    }
  }
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Class List (SSR)</h1>


      <div className="flex justify-end mb-4">
        <Link
          href="/classes/register"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Class
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
          {displayClass.map((classE) => (
            <tr key={classE.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{classE.id}</td>
              <td className="border border-gray-300 px-4 py-2">{classE.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  href={`/classes/${classE.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Detail
                </Link>
              </td>
              <td
                className="border border-gray-300 px-4 py-2 text-red-500 cursor-pointer hover:underline"
                onClick={() => handleDelete(classE.id)}
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

export default ClassList;
