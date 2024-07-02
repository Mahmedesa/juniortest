import { gql, useQuery } from "@apollo/client";

const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      name
      inStock
      category_id
      description
      price
      currency_symbol
      brand
      galleries {
        path
      }
      productattributes {
        attribute {
          name
          pais {
            attributeitem {
              id
              value
              display_value
            }
          }
        }
      }
    }
  }
`;



export const useProduct = (id) => {
  console.log(id);
  const { error, data, loading } = useQuery(GET_PRODUCT, {
    variables: { id: parseInt(id) },
  });

  return { error, data, loading };
};





