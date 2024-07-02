import { useQuery, gql } from "@apollo/client";


const GEt_CAtEGORIES = gql`
{
    categories{
      id
      name
    }
}
`;



export const useCategories = () =>{
    const{error, data, loading} = useQuery(GEt_CAtEGORIES)

    return{
        error, data, loading
    }
}
