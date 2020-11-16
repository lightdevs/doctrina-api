import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

export const filesQuery = gql`
  {
    files
  }
`;

export const Files = () => {
  const { data, loading } = useQuery(filesQuery);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {/* {data.files.map(x => (
        <div
          style={{ width: 200 }}
        >
          {x}
        </div>
      ))} */}
    </div>
  );
};