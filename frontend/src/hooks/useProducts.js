import { useQuery, gql } from "@apollo/client";


const GET_PRODUCTS = gql`
  query{
    products{
      id
      name
      image
      currency_symbol
      price
      inStock
    }
  }
`;


export const useProducts = () =>{
    const{error, data, loading} = useQuery(GET_PRODUCTS);

    return{
        error, data, loading
    }
}
