import { gql, useQuery } from "@apollo/client";

export const ADD_ORDER = gql`
  mutation addorder(
    $address: String!
    $payment_method: String!
    $items: [Int!]
  ) {
    addorder(
      address: $address
      payment_method: $payment_method
      items: $items
    ) {
      id
      address
      payment_method
      oois {
        orderitem {
          product_id
          quantity
          total_price
          oiais {
            attributeitem_id
          }
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  {
    orders {
      id
      address
      payment_method
      oois {
        orderitem_id
        orderitem {
          product {
            name
            image
            price
            currency_symbol
          }
          quantity
          total_price
          oiais {
            attributeitem {
              display_value
            }
          }
        }
      }
    }
  }
`;

export const useOrder = () => {
    const { error, data, loading } = useQuery(GET_ORDER);
    return {
      error,
      data,
      loading,
    };
  };
  