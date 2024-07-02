import { gql, useQuery } from "@apollo/client";

export const DELETE_ORDER_ITEM = gql`
  mutation deleteorderitem($id: Int!) {
    deleteorderitem(id: $id) {
      id
    }
  }
`;

export const EDIT_ORDER_ITEM = gql`
  mutation editorderitem($id: Int!, $quantity: Int!, $attributes: [Int!]) {
    editorderitem(id: $id, quantity: $quantity, attributes: $attributes) {
      id
      quantity
      product_id
      oiais {
        attributeitem_id
        attributeitem {
          id
          display_value
          pais {
            attribute {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const ADD_ORDER_ITEM = gql`
  mutation addorderitem($product_id: Int!, $quantity: Int!, $attributes: [Int!]) {
    addorderitem(product_id: $product_id, quantity: $quantity, attributes: $attributes) {
      id
    }
  }
`;

export const GET_CART = gql`
  {
    orderitems {
      id
      product_id
      quantity
      total_price
      product {
        name
        price
        currency_symbol
        image
        productattributes {
          attribute {
            id
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
      oiais {
        id
        attributeitem_id
        attributeitem {
          id
          display_value
          pais {
            attribute {
              id
              name
            }
          }
        }
      }
    }
  }
`;


export const useCart = () => {
  const { error, data, loading } = useQuery(GET_CART);
  return {
    error,
    data,
    loading,
  };
};
