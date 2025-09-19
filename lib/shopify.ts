// Shopify Storefront API utility for Next.js

const domain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "book-store-logicology.myshopify.com";

const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "88fea8397a31ec6c42e40e2f15f514f6";
const SHOPIFY_GRAPHQL_URL = `https://${domain}/api/2023-07/graphql.json`;

export async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  const res = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken || "",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

export async function getProducts() {
  const query = `
    query Products {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { edges { node { id price { amount currencyCode } } } }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query });
  return data.products.edges.map((edge: any) => edge.node);
}

export async function createCart(variantId: string, quantity: number = 1) {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { 
          id 
          checkoutUrl 
          lines(first: 10) { 
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  } 
                } 
              } 
            } 
          } 
        }
      }
    }
  `;
  const variables = { lines: [{ merchandiseId: variantId, quantity }] };
  const data = await shopifyFetch({ query, variables });
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { 
          id 
          checkoutUrl 
          lines(first: 10) { 
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  } 
                } 
              } 
            } 
          } 
        }
      }
    }
  `;
  const variables = { cartId, lines: [{ merchandiseId: variantId, quantity }] };
  const data = await shopifyFetch({ query, variables });
  return data.cartLinesAdd.cart;
}

// Add these functions to your existing lib/shopify.ts

export async function updateCartItem(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation UpdateCartItem($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { 
          id 
          checkoutUrl 
          lines(first: 10) { 
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  } 
                } 
              } 
            } 
          } 
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }],
  };
  const data = await shopifyFetch({ query, variables });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { 
          id 
          checkoutUrl 
          lines(first: 10) { 
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  } 
                } 
              } 
            } 
          } 
        }
      }
    }
  `;
  const variables = {
    cartId,
    lineIds: [lineId],
  };
  const data = await shopifyFetch({ query, variables });
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId };
  const data = await shopifyFetch({ query, variables });
  return data.cart;
}

export async function applyDiscountCode(cartId: string, discountCode: string) {
  const query = `
    mutation ApplyDiscountCode($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart { 
          id 
          checkoutUrl 
          discountAllocations {
            allocatedAmount {
              amount
            }
            discountApplication {
              ... on DiscountCodeApplication {
                code
                applicable
              }
            }
          }
          lines(first: 10) { 
            edges { 
              node { 
                id 
                quantity 
                merchandise { 
                  ... on ProductVariant { 
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      title
                    }
                  } 
                } 
              } 
            } 
          } 
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    discountCodes: [discountCode],
  };

  const data = await shopifyFetch({ query, variables });

  // Check for user errors (invalid discount codes)
  if (
    data.cartDiscountCodesUpdate.userErrors &&
    data.cartDiscountCodesUpdate.userErrors.length > 0
  ) {
    throw new Error(data.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return data.cartDiscountCodesUpdate.cart;
}
