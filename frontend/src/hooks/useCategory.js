import { gql, useQuery } from "@apollo/client";

const GET_Category = gql`
  query GetCategory($id: Int!) {
    category(id:$id){
        name
        products{
          id
          name
          image
          currency_symbol
          price
          inStock
        }
      }
  }
`;



export const useCategory = (id) => {
  console.log(id);
  const { error, data, loading } = useQuery(GET_Category, {
    variables: { id: parseInt(id) },
  });

  return { error, data, loading };
};